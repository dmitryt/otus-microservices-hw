import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PoolClient } from 'pg';
import SQL from 'sql-template-strings';
import UserModel from '../../models/user';
import { createNotFoundError } from '../../plugins/errors';
import { IUserModel } from './schema';

const getByIdOr404 = async (client: PoolClient, id: string) => {
  const { rows } = await client.query(
    SQL`SELECT * FROM users WHERE id=${id}`,
  );
  if (rows.length === 0) {
    throw createNotFoundError();
  }
  return rows[0];
};

export const getProfile = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const client = await app.pg.connect();
  try {
    const user = await getByIdOr404(client, (req.user as IUserModel).id);
    res.send(user);
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const updateProfile = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const result = await app.pg.transact(async client => {
    const user = await getByIdOr404(client, (req.user as IUserModel).id);
    const model = new UserModel(app.pg, app.log);
    return model.update(req.body, user.id);
  });
  res.send(result);
};