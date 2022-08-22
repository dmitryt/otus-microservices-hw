import { FastifyInstance } from 'fastify';
import config from './config';
import BalanceModel from './models/balance';
import { getByUserIdOr404 } from './services/balance/handlers';
import { sendToExchange, subscribeToExchange, subscribeToQueue } from './utils';

type IOrderPayload = { userId: number, id: number, price: number };

export type IAmqpHandlers = {
  [key: string]: ((msg: any, options: any) => Promise<any>) | undefined,
};

const initRoutes = (app: FastifyInstance) => [
  function userCreated() {
    const handler = async ({ userId }: { userId: string }) => {
      const model = new BalanceModel(app.pg, app.log);
      return model.create({ balance: 0, user_id: userId });
    };
    subscribeToQueue(app, config.amqp.queues.users, handler);
  },
  function orderCreated() {
    const exchange = config.amqp.exchanges.orders;
    const handler = async ({ userId, id: orderId, price }: IOrderPayload) => {
      const send = (payload: any) => {
        sendToExchange(app, exchange, 'ORDER_PAID', payload);
      };
      await app.pg.transact(async client => {
        const model = new BalanceModel(app.pg, app.log);
        try {
          const balance = await getByUserIdOr404(client, userId);
          const newBalance = balance.balance - price;
          if (newBalance < 0) {
            send({ error: 'NOT_ENOUGH_MONEY', orderId, status: 'failed' });
            return;
          }
          await model.update({ balance: newBalance }, balance.id);
          send({ data: {}, orderId, status: 'success' });
        } catch (e) {
          app.log.error(e);
          send({ error: 'INTERNAL_SERVER_ERROR', orderId, status: 'failed' });
        }
      });
    };
    subscribeToExchange(
      app,
      exchange,
      ['ORDER_CREATED'],
      handler,
      config.amqp.queues.orderCreated,
    );
  }
];

export default initRoutes;