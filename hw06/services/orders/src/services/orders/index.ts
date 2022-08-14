import { FastifyInstance } from '../../plugins';
import { createOrder } from './handlers';
import { orderPayload } from './schema';

const routes = async (app: FastifyInstance) => {
  app.post('/', {
    handler: createOrder(app),
    schema: { body: orderPayload },
  });
};

export default routes;