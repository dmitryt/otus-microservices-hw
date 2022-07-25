import Fastify from 'fastify';
import config from './config';
import initRoutes from './routes';
import initPlugins from './plugins';

const fastify = Fastify({
  logger: true
});

const rootPath = '/v1';

/**
 * Run the server!
 */
const start = async () => {
  await initPlugins(fastify);
  await initRoutes(fastify, { rootPath });
  try {
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
