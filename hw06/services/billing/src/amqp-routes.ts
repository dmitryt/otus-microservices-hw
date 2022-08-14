import { FastifyInstance } from 'fastify';
import config from './config';
import BalanceModel from './models/balance';
import { getByUserIdOr404 } from './services/balance/handlers';

const { queues } = config.amqp;

type IOrderPayload = { userId: number, orderId: number, price: number };

const init = (app: FastifyInstance) => ({
  [queues.users]: {
    USER_CREATED: async ({ userId }: { userId: string }) => {
      const model = new BalanceModel(app.pg, app.log);
      return model.create({ balance: 0, user_id: userId });
    },
  },
  [queues.orders]: {
    ORDER_CREATED: async ({ userId, orderId, price }: IOrderPayload, { correlationId }: { correlationId: string}) => {
      const { channel } = app.amqp;
      const sendToQueue = (payload: any) => {
        channel.sendToQueue(
          config.amqp.queues.orders,
          Buffer.from(JSON.stringify({ eventType: 'ORDER_PAID', payload })),
          { correlationId }
        );
      };
      await app.pg.transact(async client => {
        const model = new BalanceModel(app.pg, app.log);
        try {
          const balance = await getByUserIdOr404(client, userId);
          const newBalance = balance.balance - price;
          if (newBalance < 0) {
            sendToQueue({ error: 'NOT_ENOUGH_MONEY', orderId, status: 'failed' });
            return;
          }
          await model.update({ balance: newBalance }, balance.id);
          sendToQueue({ data: {}, orderId, status: 'success' });
        } catch (e) {
          app.log.error(e);
          sendToQueue({ error: 'INTERNAL_SERVER_ERROR', orderId, status: 'failed' });
        }
      });
    },
  },
});

export type IAmqpHandlers = {
  [key: string]: ((msg: any, options: any) => Promise<any>) | undefined,
};

export default init;