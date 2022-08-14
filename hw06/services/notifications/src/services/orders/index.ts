import { FastifyInstance } from '../../plugins';
import { getNotifications } from './handlers';

const routes = async (app: FastifyInstance) => {
  app.get('/', {
    handler: getNotifications(app),
  });
};

export default routes;