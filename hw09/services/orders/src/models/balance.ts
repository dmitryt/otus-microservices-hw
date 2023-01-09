import { PostgresDb } from "@fastify/postgres";
import { FastifyLoggerInstance } from "fastify";
import { generateInsertSQLRequest, generateUpdateSQLRequest } from "../util";

const tableName = 'balances';
const updatePayloadFields = [
  'balance',
];
const insertPayloadFields = [
  'user_id', ...updatePayloadFields,
];

class BalanceModel {
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
      return rows[0];
    });
  }
}

export default BalanceModel;