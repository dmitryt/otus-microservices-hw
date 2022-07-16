import { FastifyInstance } from 'fastify';

const routes = async (app: FastifyInstance) => {
  app.get('/', () => ({status: 'OK'}));
};

export default routes;