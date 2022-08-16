import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyInstance } from '../../plugins';

export const getNotifications = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const orderId = (req.params as any).orderId;
  const result = await app.knex!('notifications').where({ order_id: orderId });
  res.send(result[0]);
};