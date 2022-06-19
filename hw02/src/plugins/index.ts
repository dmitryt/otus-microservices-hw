import { FastifyInstance } from 'fastify';
import { errorHandler, notFoundErrorHandler } from './errors';
import initDb from './db';
import validationCompiler from './validation';
import { IConfig } from '../config/types';

const init = async (app: FastifyInstance, config: IConfig) => {
  app.setValidatorCompiler(validationCompiler);
  app.setErrorHandler(errorHandler(app));
  app.setNotFoundHandler(notFoundErrorHandler(app));
  await initDb(app, config);
};

export default init;