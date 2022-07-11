import { FastifyInstance } from 'fastify';
import { errorHandler, notFoundErrorHandler } from './errors';
import initDb from './db';
import validationCompiler from './validation';

const init = async (app: FastifyInstance) => {
  app.setValidatorCompiler(validationCompiler);
  app.setErrorHandler(errorHandler(app));
  app.setNotFoundHandler(notFoundErrorHandler(app));
  await initDb(app);
};

export default init;