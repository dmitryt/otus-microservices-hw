import Fastify from 'fastify';
import config from './config';
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
  await initPlugins(fastify);
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