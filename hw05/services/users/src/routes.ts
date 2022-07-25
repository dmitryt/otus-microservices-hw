import { FastifyInstance } from 'fastify';

import Profile from './services/profile';
import Health from './services/health';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, {rootPath}: IOptions) => {
  await app.register(Profile, { prefix: `${rootPath}/profile`});
  await app.register(Health, { prefix: `${rootPath}/health`});
};

export default init;
