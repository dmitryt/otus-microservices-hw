import FastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyRequest } from 'fastify';
import config from '../config';

const init = async (app: FastifyInstance) => {
  await app.register(FastifyJwt, {
    secret: config.secret,
  });

  app.addHook('onRequest', async (req: FastifyRequest) => {
    await req.jwtVerify();
  });
};

export default init;