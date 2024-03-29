import crypto from 'crypto';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import UserModel from '../models/user';
import config from '../config';
import { createForbiddenError, createValidationError } from '../plugins/errors';

const phoneRegexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-. \\/]?)?((?:\(?\d{1,}\)?[-. \\/]?){0,})(?:[-. \\/]?(?:#|ext\.?|extension|x)[-. \\/]?(\d+))?$/;

const saltPassword = (password: string, salt: string) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

interface ILoginRequest {
  username: string;
  password: string;
}

interface IRegisterRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const RegisterSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }).message('Must be valid email'),
    phone: Joi.string().pattern(phoneRegexp).message('Must be valid phone')
  }).required()
};

const LoginSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required()
};

const routes = async (app: FastifyInstance) => {
  app.post('/signup', {
    schema: RegisterSchema,
    validatorCompiler: ({ schema }) => {
      return data => (schema as any).validate(data);
    },
  }, async (req: FastifyRequest, res: FastifyReply) => {
    const payload = req.body as IRegisterRequest;
    const model = new UserModel(app.pg, app.log);
    const userInDb = await model.findByUserName(payload.username);
    if (userInDb) {
      throw createValidationError('User with such username already exists');
    }
    const user = await model.create({
      ...payload,
      password: saltPassword(payload.password, config.secret),
    });
    const { password, ...rest } = user;

    app.log.debug(`User created ${JSON.stringify(user)}`);

    const correlationId = uuidv4();

    const { channel } = app.amqp;
    const replyQueue = await channel.assertQueue('', {
      exclusive: true
    });

    channel.sendToQueue(
      config.amqp.queues.users,
      Buffer.from(JSON.stringify({ eventType: 'USER_CREATED', payload: { userId: user.id } })),
      { correlationId, replyTo: replyQueue.queue }
    );

    const msg = await new Promise((resolve) => {
      channel.consume(replyQueue.queue, (msg: any) => {
        app.log.debug(`Received msg ${JSON.stringify(msg)}`);
        if (msg.properties.correlationId === correlationId) {
          resolve(msg);
        }
      }, {
        noAck: true
      });
    }) as any;

    app.log.debug(`Got ${msg.content.toString()}`);
    const { balance } = JSON.parse(msg.content.toString());

    res.send({...rest, balance });
  });
  app.post('/signin', {
    schema: LoginSchema,
    validatorCompiler: ({ schema }) => {
      return data => (schema as any).validate(data);
    },
  }, async (req: FastifyRequest, res: FastifyReply) => {
    const model = new UserModel(app.pg, app.log);
    const payload = req.body as ILoginRequest;
    const user = await model.findByUserName(payload.username);
    if (!user || user.password !== saltPassword(payload.password, config.secret)) {
      throw createForbiddenError('Username or password is invalid');
    }
    const token = await res.jwtSign({ id: user.id, username: user.username }, { sign: { expiresIn: '1h' }});
    res.send({ token });
  });
};

export default routes;