import FastifyFavicon from 'fastify-favicon';
import { FastifyInstance } from 'fastify';

import config from './config';
import { subscribeToQueue } from './utils';
import Orders, { processOrdersRequestHandler } from './services/orders';
import Health from './services/health';

interface IOptions {
  rootPath: string
}

export const initRoutes = async (app: FastifyInstance, { rootPath }: IOptions) => {
  await app.register(FastifyFavicon, { logLevel: 'trace' });
  await app.register(Orders, { prefix: `${rootPath}/orders` });
  await app.register(Health, { prefix: `${rootPath}/health`, logLevel: 'trace' });
};

export type IAmqpHandlers = {
  [key: string]: ((msg: any, options: any) => Promise<any>) | undefined,
};