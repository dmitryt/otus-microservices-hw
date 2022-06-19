process.env.NODE_CONFIG_DIR = `${__dirname}/config`;
/* eslint-disable import/first, import/order */
const config = require('config');

import Fastify from 'fastify';
import Joi from 'joi';
import initRoutes from './routes';
import initPlugins from './plugins';

/* eslint-enable import/first, import/order */

const fastify = Fastify({
  logger: true
});

const appVersion = 'v1';

/**
 * Run the server!
 */
const start = async () => {
  await initPlugins(fastify, config);
  await initRoutes(fastify, { appVersion });
  try {
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

// docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres14-alpine