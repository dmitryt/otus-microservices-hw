import { FastifyInstance } from 'fastify';
import { getUser, createUser } from './handlers';
import { newUserSchema } from './schema';

const routes = async (app: FastifyInstance) => {
  app.get('/:id', getUser(app));
  app.post('/', {
    handler: createUser(app),
    schema: { body: newUserSchema },
  });
  app.put('/:id', () => ({ 'name': 'John' }));
  app.delete('/:id', () => ({ 'name': 'John' }));
};

export default routes;