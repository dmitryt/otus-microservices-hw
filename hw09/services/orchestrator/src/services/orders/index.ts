import { FastifyInstance } from 'fastify';
import { createOrderRequest } from './handlers';
import { orderPayload } from './schema';

const routes = async (app: FastifyInstance) => {
  app.post('/', {
    handler: createOrderRequest(app),
    schema: { body: orderPayload },
  });
};

export { processOrdersRequestHandler } from './handlers';

export default routes;