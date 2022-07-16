import { PostgresDb } from "@fastify/postgres";
import { FastifyLoggerInstance } from "fastify";
import SQL from 'sql-template-strings';

class UserModel {
  constructor(readonly pg: PostgresDb, readonly logger: FastifyLoggerInstance) {}

  async create(data: any) {
    return this.pg.transact(async client => {
      const {username, password, email, phone} = data;
      const query = SQL`INSERT INTO users(username, password, email, phone) VALUES(${username}, ${password}, ${email}, ${phone}) RETURNING id, username, password, email, phone`;
      this.logger.info(`INSERT QUERY: ${query}`);
      const { rows } = await client.query(query);
      return rows[0];
    });
  }

  async findByUserName(username: string) {
    const { rows } = await this.pg.query(
      SQL`SELECT id, username, password, email, phone FROM users WHERE username=${username}`,
    );
    return rows[0];
  }
}

export default UserModel;