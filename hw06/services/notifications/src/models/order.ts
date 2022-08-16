import { PostgresDb } from "@fastify/postgres";
import { FastifyLoggerInstance } from "fastify";
import { generateInsertSQLRequest, generateUpdateSQLRequest } from "../util";

const tableName = 'orders';
const relationsTableName = 'orders_items';
const updatePayloadFields = [
  'balance',
];
const insertPayloadFields = [
  'user_id', ...updatePayloadFields,
];

class OrderModel {
  constructor(readonly pg: PostgresDb, readonly logger: FastifyLoggerInstance) {}

  async create(data: any) {
    return this.pg.transact(async client => {
      const orderQuery = generateInsertSQLRequest(tableName, ['user_id', 'status'], data);
      this.logger.info(`QUERY: ${JSON.stringify(orderQuery)}`);
      const { rows } = await client.query(orderQuery);
      const orderItemsQuery = generateInsertSQLRequest(relationsTableName, ['order_id', 'item_id'], data);
      return rows[0];
    });
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

export default OrderModel;