import FastifyPostgres from '@fastify/postgres';
import { FastifyInstance } from 'fastify';
import { IConfig } from '../config/types';

const init = async (app: FastifyInstance, {db}: IConfig) => {
  await app.register(FastifyPostgres, {
    connectionString: `postgres://${db.user}:${db.pass}@${db.host}:${db.port}/${db.dbName}`,
  });
};

export default init;