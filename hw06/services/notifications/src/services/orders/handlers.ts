import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyInstance } from '../../plugins';
import { IUserModel } from './schema';

export const getNotifications = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const userId = (req.user as IUserModel).id;
  const result = await app.knex!('notifications').where({ user_id: userId });
  res.send(result);
};