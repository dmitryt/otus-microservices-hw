import { FastifyInstance } from 'fastify';
import { getProfile, updateProfile } from './handlers';
import { userPayload } from './schema';

const routes = async (app: FastifyInstance) => {
  app.get('/', { handler: getProfile(app) });
  app.put('/', {
    handler: updateProfile(app),
    schema: { body: userPayload },
  });
};

export default routes;