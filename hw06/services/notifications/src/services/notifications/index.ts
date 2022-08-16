import { FastifyInstance } from '../../plugins';
import { getNotifications } from './handlers';

const routes = async (app: FastifyInstance) => {
  app.get('/:orderId', {
    handler: getNotifications(app),
  });
};

export default routes;