import FastifyFavicon from 'fastify-favicon';
import { FastifyInstance } from 'fastify';

import Balance from './services/balance';
import Health from './services/health';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, {rootPath}: IOptions) => {
  await app.register(FastifyFavicon, { logLevel: 'trace' });
  await app.register(Balance, { prefix: `${rootPath}/balance`});
  await app.register(Health, { prefix: `${rootPath}/health`, logLevel: 'trace'});
};

export default init;
