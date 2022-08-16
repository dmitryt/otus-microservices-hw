import Notifications from './services/notifications';
import Health from './services/health';
import { FastifyInstance } from './plugins';

interface IOptions {
  rootPath: string
}

const init = async (app: FastifyInstance, { rootPath }: IOptions) => {
  await app.register(Notifications, { prefix: `${rootPath}/notifications` });
  await app.register(Health, { prefix: `${rootPath}/health` });
};

export default init;
