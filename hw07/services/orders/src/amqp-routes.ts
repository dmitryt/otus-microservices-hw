import config from './config';
import { FastifyInstance } from './plugins';
import { subscribeToExchange } from './utils';

type IOrderPayload = { orderId: number, status: string };

export type IAmqpHandlers = {
  [key: string]: ((msg: any, options: any) => Promise<any>) | undefined,
};

const initRoutes = (app: FastifyInstance) => [
  function orderPaidSuccess() {
    const exchange = config.amqp.exchanges.orders;
    const handler = async ({ orderId, status }: IOrderPayload) => {
      if (status === 'success') {
        await app.knex!('orders').update({ status: 'Paid', purchased_at: app.knex!.fn.now()}).where({ id: orderId});
      }
    };
    subscribeToExchange(app, exchange, ['ORDER_PAID'], handler);
  }
];

export default initRoutes;