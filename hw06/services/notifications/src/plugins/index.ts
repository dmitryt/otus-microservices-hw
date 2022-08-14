import { FastifyInstance as FastifyInstanceOrig } from 'fastify';
import { errorHandler, notFoundErrorHandler } from './errors';
import initKnex from './knex';
import initAuth from './auth';
import initAmqp from './amqp';
import validationCompiler from './validation';
import config from '../config';
import { Knex } from 'knex';

export type FastifyInstance = FastifyInstanceOrig & { knex?: Knex };

const init = async (app: FastifyInstanceOrig) => {
  const {user, pass, host, port, dbName } = config.db || {};
  const connection = `postgres://${user}:${pass}@${host}:${port}/${dbName}`;
  const options = {
    client: 'pg',
    connection,
  };

  app.setValidatorCompiler(validationCompiler);
  app.setErrorHandler(errorHandler(app));
  app.setNotFoundHandler(notFoundErrorHandler(app));
  await initKnex(app, options);
  await initAmqp(app);
  await initAuth(app as FastifyInstance);
};

export default init;