import crypto from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import UserModel from '../models/user';
import config from '../config';
import { createForbiddenError, createValidationError } from '../plugins/errors';

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

const isString = (data: any): boolean => typeof data === 'string';

const checkLoginRequest = (data: any): data is ILoginRequest => {
  return isString(data?.username) && isString(data?.password);
}

const checkRegisterRequest = (data: any): data is IRegisterRequest => {
  return isString(data?.username) &&
    isString(data?.password) &&
    isString(data?.firstName || '') &&
    isString(data?.lastName || '') &&
    isString(data?.email || '') &&
    isString(data?.phone || '');
}

const routes = async (app: FastifyInstance) => {
  app.post('/signup', async (req: FastifyRequest, res: FastifyReply) => {
    const model = new UserModel(app.pg, app.log);
    if (!checkRegisterRequest(req.body)) {
      throw createValidationError('Not all required parameters were provided');
    }
    const userInDb = await model.findByUserName(req.body.username);
    if (userInDb) {
      throw createValidationError('User with such username already exists');
    }
    const user = await model.create({
      ...req.body,
      password: saltPassword(req.body.password, config.secret),
    });
    const { password, ...rest } = user;
    res.send({ ...rest });
  });
  app.post('/signin', async (req: FastifyRequest, res: FastifyReply) => {
    const model = new UserModel(app.pg, app.log);
    if (!checkLoginRequest(req.body)) {
      throw createValidationError('Username or password was not provided');
    }
    const user = await model.findByUserName(req.body.username);
    if (!user || user.password !== saltPassword(req.body.password, config.secret)) {
      throw createForbiddenError('Username or password is invalid');
    }
    const token = await res.jwtSign({ id: user.id, username: user.username }, { sign: { expiresIn: '1m' }});
    res.send({ token });
  });
};

export default routes;