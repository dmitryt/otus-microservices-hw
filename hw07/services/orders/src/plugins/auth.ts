import FastifyJwt from '@fastify/jwt';
import { FastifyRequest } from 'fastify';
import { FastifyInstance } from '.';
import config from '../config';

const   init = async (app: FastifyInstance, publicRoutes?: string[]) => {
  await app.register(FastifyJwt, {
    secret: config.secret,
  });

  app.addHook('onRequest', async (req: FastifyRequest) => {
    if (!publicRoutes?.includes(req.url)) {
      app.log.info(`jwt verify for route ${req.url}`);
      await req.jwtVerify();
    }
  });
};

export default init;