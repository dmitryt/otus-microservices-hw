import FastifyPostgres from '@fastify/postgres';
import { FastifyInstance } from 'fastify';
import config from '../config';

const init = async (app: FastifyInstance) => {
  const {user, pass, host, port, dbName } = config.db || {};
  await app.register(FastifyPostgres, {
    connectionString: `postgres://${user}:${pass}@${host}:${port}/${dbName}`,
  });
};

export default init;