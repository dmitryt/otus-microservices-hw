import Orders from './services/orders';
import Health from './services/health';
import { FastifyInstance } from './plugins';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, {rootPath}: IOptions) => {
  await app.register(Orders, { prefix: `${rootPath}/orders`});
  await app.register(Health, { prefix: `${rootPath}/health`});
};

export default init;
