import {
  FastifyError, FastifyInstance, FastifyReply, FastifyRequest
} from 'fastify';
import { ValidationError } from 'joi';

const createError = require('@fastify/error');

export const errorHandler = (app: FastifyInstance) =>
  (error: FastifyError, req: FastifyRequest<any>, res: FastifyReply) => {
    let { statusCode = 500} = error;
    if (error instanceof ValidationError) {
      statusCode = 400;
    }
    let { message } = error;
    if (statusCode < 500) {
      app.log.info(error);
    } else {
      app.log.error(error);
      message = 'Something went wrong';
    }
    res.status(statusCode).send({
      code: statusCode,
      message,
    });
  };

export const createNotFoundError = (msg: string) => {
  const Error = createError('NOT_FOUND', msg, 404);
  return new Error();
};

export const notFoundErrorHandler = (app: FastifyInstance) => {
  const handler = errorHandler(app);
  return (req: FastifyRequest<any>, res: FastifyReply) => handler(createNotFoundError(`${req.url} not found`), req, res);
};

export const createDbError = (msg: string) => {
  const Error = createError('DB_ERROR', msg, 500);
  return new Error();
};

export const createUnhandledError = (msg: string) => {
  const Error = createError('UNHANDLED_ERROR', msg, 500);
  return new Error();
};