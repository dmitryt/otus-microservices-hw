import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PoolClient } from 'pg';
import SQL from 'sql-template-strings';
import BalanceModel from '../../models/balance';
import { createNotFoundError } from '../../plugins/errors';
import { IUserModel, IBalancePayload } from './schema';

const getByIdOr404 = async (client: PoolClient, id: string) => {
  const { rows } = await client.query(
    SQL`SELECT * FROM balances WHERE user_id=${id}`,
  );
  if (rows.length === 0) {
    throw createNotFoundError();
  }
  return rows[0];
};

export const getBalance = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const client = await app.pg.connect();
  try {
    const balance = await getByIdOr404(client, (req.user as IUserModel).id);
    res.send(balance);
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const updateBalance = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const result = await app.pg.transact(async client => {
    const model = new BalanceModel(app.pg, app.log);
    const userId = (req.user as IUserModel).id;
    const payload = req.body as IBalancePayload;
    try {
      const balance = await getByIdOr404(client, userId);
      return model.update({...payload, amount: payload.amount + balance.amount}, balance.id);
    } catch (e) {
      if ((e as Error).name === 'NOT_FOUND') {
        // Create balance, when it doesn't exist
        return model.create({...payload, user_id: userId});
      }
      throw e;
    }
  });
  res.send(result);
};