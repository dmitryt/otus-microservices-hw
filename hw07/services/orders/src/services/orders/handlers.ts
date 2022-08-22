import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config';
import { FastifyInstance } from '../../plugins';
import { createConflictError } from '../../plugins/errors';
import { hash, sendToExchange } from '../../utils';
import { IUserModel, IOrderPayload } from './schema';

export const createOrder = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const payload = req.body as IOrderPayload;
  const userId = (req.user as IUserModel).id;
  const fingerprint = hash({...payload, userId });
  let orderId = -1;
  try {
    await app.knex!.transaction(async trx => {
      await trx('transaction_locks')
      // remove all items, which were inserted earlier, than 5 minutes ago
      .where('inserted_at', '<', new Date(Date.now() - 5*60*1000).toISOString())
      .del();

      await trx
      .insert({ hash: fingerprint })
      .into('transaction_locks');

      [{ id: orderId }] = await trx
      .insert({ user_id: userId, status: 'New' })
      .into('orders')
      .returning('id');
    });
  } catch (e) {
    const idempotentError = 'insert into "transaction_locks" ("hash") values ($1) - duplicate key value violates unique constraint "hash_unique"';
    if ((e as Error).message === idempotentError) {
      throw createConflictError('Current order is processing');
    }
    throw e;
  }
  try {
    await Promise.all(
      payload.items.map(({ id, amount }) => {
        const fields = [
          'orders_items', 'order_id', 'item_id', 'amount', 'price',
        ];
        const query = app.knex!.from(app.knex!.raw('?? (??, ??, ??, ??)', fields))
          .insert(function () {
            // @ts-ignore
            this.from('items as i')
              .select(
                app.knex!.raw('? AS ??', [orderId, 'order_id']),
                app.knex!.raw('? AS ??', [id, 'item_id']),
                app.knex!.raw('? AS ??', [amount, 'amount']),
                'price',
              )
              .where('i.id', id)
          });
        return query;
      })
    );
  } catch (e) {
    app.log.error(e);
    await app.knex!('orders')
      .where({ id: orderId })
      .del();
  }
  const result = await app.knex!('orders')
    .select(
      'orders.id as id',
      'orders.user_id as user_id',
      'orders_items.item_id as item_id',
      'orders_items.amount as amount',
      'orders_items.price as price',
    )
    .where({ id: orderId })
    .innerJoin(
      'orders_items',
      'orders.id',
      '=',
      'orders_items.order_id'
    );
  const convertedResult = result.reduce((acc, { id, user_id, item_id, amount, price }) => ({
    ...acc,
    id,
    userId: user_id,
    price: acc.price + amount * price,
    items: [...acc.items, { id: item_id, amount, price }],
  }), { items: [], price: 0 });

  sendToExchange(app, config.amqp.exchanges.orders, 'ORDER_CREATED', convertedResult);
  res.send(convertedResult);
};