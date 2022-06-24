import { FastifyInstance } from 'fastify';
import metricsPlugin from 'fastify-metrics';

import Users from './services/users';
import Health from './services/health';

interface IOptions {
  appVersion: string
}

const init = async (app: FastifyInstance, {appVersion}: IOptions) => {
  await app.register(Users, { prefix: `/api/${appVersion}/users`});
  await app.register(Health, { prefix: `/api/${appVersion}/health`});
  await app.register(metricsPlugin, { endpoint: '/metrics' });
};

export default init;
