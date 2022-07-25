import FastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import config from '../config';

const init = async (app: FastifyInstance) => {
  await app.register(FastifyJwt, {
    secret: config.secret,
  });
};

export default init;