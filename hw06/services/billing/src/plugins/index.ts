import { FastifyInstance } from 'fastify';
import { errorHandler, notFoundErrorHandler } from './errors';
import initDb from './db';
import initAuth from './auth';
import initAmqp from './amqp';
import validationCompiler from './validation';

const init = async (app: FastifyInstance, publicRoutes?: string[]) => {
  app.setValidatorCompiler(validationCompiler);
  app.setErrorHandler(errorHandler(app));
  app.setNotFoundHandler(notFoundErrorHandler(app));
  await initDb(app);
  await initAmqp(app);
  await initAuth(app, publicRoutes);
};

export default init;