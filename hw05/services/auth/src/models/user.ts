import { PostgresDb } from "@fastify/postgres";
import { FastifyLoggerInstance } from "fastify";
import SQL from 'sql-template-strings';
import { generateInsertSQLRequest, generateUpdateSQLRequest } from "../util";

const tableName = 'users';
const updatePayloadFields = [
  'first_name', 'last_name', 'email', 'phone',
];
const insertPayloadFields = [
  'username', 'password', ...updatePayloadFields,
];

class UserModel {
  constructor(readonly pg: PostgresDb, readonly logger: FastifyLoggerInstance) {}

  async create(data: any) {
    const query = generateInsertSQLRequest(tableName, insertPayloadFields, data);
    return this._execQuery(query);
  }

  async update(data: any, id: string) {
    const query = generateUpdateSQLRequest(tableName, updatePayloadFields, data, id);
    return this._execQuery(query);
  }

  private _execQuery(query: [string, string[]]) {
    return this.pg.transact(async client => {
      this.logger.info(`QUERY: ${JSON.stringify(query)}`);
      const { rows } = await client.query(...query);
      const {password, ...rest} = rows[0];
      return rest;
    });
  }

  async findByUserName(username: string) {
    const { rows } = await this.pg.query(
      SQL`SELECT * FROM users WHERE username=${username}`,
    );
    return rows[0];
  }
}

export default UserModel;