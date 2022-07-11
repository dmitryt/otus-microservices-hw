import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PoolClient } from 'pg';
import SQL from 'sql-template-strings';
import { createNotFoundError, createUnhandledError } from '../../plugins/errors';

const getByIdOr404 = async (client: PoolClient, id: string) => {
  const { rows } = await client.query(
    SQL`SELECT id, username, email, phone FROM users WHERE id=${id}`,
  );
  if (rows.length === 0) {
    throw createNotFoundError(`User ${id} was not found`);
  }
  return rows[0];
};

export const getUsers = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  if (req.query.withRandomErrors && Math.random() < 0.25) {
    throw createUnhandledError('Something went wrong');
  }
  const client = await app.pg.connect();
  try {
    const { rows } = await client.query(
      SQL`SELECT id, username, email, phone FROM users`,
    );
    res.send(rows);
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const getUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const client = await app.pg.connect();
  try {
    const item = await getByIdOr404(client, req.params.id);
    res.send(item);
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const deleteUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const client = await app.pg.connect();
  try {
    await getByIdOr404(client, req.params.id);
    await client.query(
      SQL`DELETE FROM users WHERE id=${req.params.id}`,
    );
    const code = 204;
    res.send({ code, message: '' });
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
};

export const createUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const result = await app.pg.transact(async client => {
    const {username, email, phone} = req.body;
    const query = SQL`INSERT INTO users(username, email, phone) VALUES(${username}, ${email}, ${phone}) RETURNING id, username, email, phone`;
    app.log.info(`INSERT QUERY: ${query}`);
    const { rows } = await client.query(query);
    return rows[0];
  });
  res.send(result);
};

export const updateUser = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const result = await app.pg.transact(async client => {
    await getByIdOr404(client, req.params.id);
    const {username, email, phone} = req.body;
    const query = SQL`UPDATE users SET username=${username}, email=${email}, phone=${phone} WHERE id=${req.params.id} RETURNING id, username, email, phone`;
    app.log.info(`UPDATE QUERY: ${query}`);
    const { rows } = await client.query(query);
    return rows[0];
  });
  res.send(result);
};