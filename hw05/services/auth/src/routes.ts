import { FastifyInstance } from 'fastify';

import Health from './services/health';
import Auth from './services/auth';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, {rootPath}: IOptions) => {
  await app.register(Auth, { prefix: `${rootPath}/auth`});
  await app.register(Health, { prefix: `${rootPath}/health`});
};

export default init;
