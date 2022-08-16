import FastifyAmqp from 'fastify-amqp';
import { FastifyInstance } from 'fastify';

import initAmqpRoutes from '../amqp-routes';
import config from '../config';

const init = async (app: FastifyInstance) => {
  const {user, pass, host, port, vhost } = config.amqp || {};
  await app.register(FastifyAmqp, {
    hostname: host,
    port,
    username: user,
    password: pass,
    vhost
  });

  const amqpRoutes = initAmqpRoutes(app);
  for (const initRoute of amqpRoutes) {
    initRoute();
  }
};

export default init;