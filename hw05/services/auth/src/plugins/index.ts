import { FastifyInstance } from 'fastify';
import { errorHandler, notFoundErrorHandler } from './errors';
import initDb from './db';
import initAuth from './auth';
import validationCompiler from './validation';

interface IParams {
  publicRoutes: string[];
};

const init = async (app: FastifyInstance, { publicRoutes}: IParams) => {
  app.setValidatorCompiler(validationCompiler);
  app.setErrorHandler(errorHandler(app));
  app.setNotFoundHandler(notFoundErrorHandler(app));
  await initDb(app);
  await initAuth(app, publicRoutes);
};

export default init;