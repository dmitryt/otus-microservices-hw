import { PoolClient } from 'pg';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import SQL from 'sql-template-strings';
import { createDbError } from '../../plugins/errors';

const connectToDb = async (app: FastifyInstance): Promise<PoolClient> => {
  try {
    const result = await app.pg.connect();
    return result;
  } catch (e) {
    app.log.error(e);
    throw createDbError('Error, cannot connect to DB');
  }
};

export const getUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const client = await connectToDb(app);
  try {
    const { rows } = await client.query(
      SQL`SELECT id, username, email, phone FROM users WHERE id=${req.params.id}`,
    );
    res.send(rows[0]);
  } catch (e) {
    app.log.error(e);
    throw new Error('Error, while getting the user');
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const createUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  try {
    const result = await app.pg.transact(async client => {
      const {username, email, phone} = req.body;
      const { rows: inserted } = await client.query(SQL`INSERT INTO users(username, email, phone) VALUES(${username}, ${email}, ${phone}) RETURNING id`);
      const { rows } = await client.query(
        SQL`SELECT id, username, email, phone FROM users WHERE id=${inserted[0].id}`,
      );
      return rows[0];
    });
    res.send(result);
  } catch (e) {
    app.log.error(e);
    throw new Error('Error, while creating the user');
  }
};