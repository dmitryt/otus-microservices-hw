import { FastifyInstance } from 'fastify';

import Users from './services/users';
import Health from './services/health';
import Auth from './services/auth';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, {rootPath}: IOptions) => {
  await app.register(Users, { prefix: `${rootPath}/users`});
  await app.register(Health, { prefix: `${rootPath}/health`});
};

export default init;
