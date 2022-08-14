import knex, { Knex } from 'knex';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

function knexPlugin(fastify: FastifyInstance & { knex: Knex }, options: any) {
  if(!fastify.knex) {
    const knexInstance = knex(options);
    fastify.decorate('knex', knexInstance);

    fastify.addHook('onClose', (fastify: any, done: any) => {
      if (fastify.knex === knexInstance) {
        fastify.knex.destroy(done);
      }
    })
  }
}

export default fp(knexPlugin as any, { name: 'fastify-knex' });