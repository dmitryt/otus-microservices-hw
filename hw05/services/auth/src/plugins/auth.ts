import FastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import config from '../config';

const init = async (app: FastifyInstance, publicRoutes?: string[]) => {
  await app.register(FastifyJwt, {
    secret: config.secret,
  });

  app.addHook('onRequest', async (req: FastifyRequest, res: FastifyReply) => {
    if (!publicRoutes?.some((path => req.url.startsWith(path)))) {
      await req.jwtVerify();
    }
  });
};

export default init;