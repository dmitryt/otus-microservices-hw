import Fastify from 'fastify';
import config from './config';
import initRoutes from './routes';
import initPlugins from './plugins';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }
});

const appVersion = 'v1';
const rootPath = `/api/${appVersion}`;

const publicRoutes = [
  `${rootPath}/health`,
  '/favicon.ico',
];

/**
 * Run the server!
 */
const start = async () => {
  await initPlugins(fastify, publicRoutes);
  await initRoutes(fastify, { rootPath });
  try {
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
