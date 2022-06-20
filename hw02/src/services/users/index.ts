import { FastifyInstance } from 'fastify';
import { getUser, getUsers, createUser, deleteUser, updateUser } from './handlers';
import userSchema from './schema';

const routes = async (app: FastifyInstance) => {
  app.get('/', { handler: getUsers(app) });
  app.get('/:id', { handler: getUser(app) });
  app.delete('/:id', { handler: deleteUser(app) });
  app.post('/', {
    handler: createUser(app),
    schema: { body: userSchema },
  });
  app.put('/:id', {
    handler: updateUser(app),
    schema: { body: userSchema },
  });
};

export default routes;