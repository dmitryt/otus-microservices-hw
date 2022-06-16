process.env.NODE_CONFIG_DIR = `${__dirname}/config`;
/* eslint-disable import/first */
import Fastify from 'fastify';

const config = require('config').default;
/* eslint-enable import/first */

const fastify = Fastify({
  logger: true
});

fastify.get('/health', async () => ({status: 'OK'}));

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();