import Fastify from 'fastify';
import config from './config';
import initRoutes from './routes';
import initPlugins from './plugins';

/* eslint-enable import/first, import/order */

const fastify = Fastify({
  logger: true
});

const appVersion = 'v1';
const rootPath = `/api/${appVersion}`;
const publicRoutes = [
  `${rootPath}/auth`,
];

/**
 * Run the server!
 */
const start = async () => {
  await initPlugins(fastify, { publicRoutes });
  await initRoutes(fastify, { rootPath });
  try {
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
