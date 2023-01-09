import { FastifyInstance } from 'fastify';
import { getBalance, updateBalance } from './handlers';
import { balancePayload } from './schema';

const routes = async (app: FastifyInstance) => {
  app.get('/', { handler: getBalance(app) });
  app.put('/', {
    handler: updateBalance(app),
    schema: { body: balancePayload },
  });
};

export default routes;