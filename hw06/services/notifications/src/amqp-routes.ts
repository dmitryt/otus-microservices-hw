import config from './config';
import { FastifyInstance } from './plugins';
import { subscribeToExchange } from './utils';

type IOrderPayload = { status: string, orderId: number, error?: string };

const initRoutes = (app: FastifyInstance) => [
  function orderPaid() {
    const exchange = config.amqp.exchanges.orders;
    const handler = async ({ orderId, status, error }: IOrderPayload ) => {
      const genMessage = () => {
        if (status === 'success') {
          return `Order ${orderId} was paid successfully`;
        }
        return `There was a following error during paying for the order ${orderId}: ${error}`;
      };
      await app.knex!('notifications').insert({ order_id: orderId, message: genMessage() });
    }

    subscribeToExchange(app, exchange, ['ORDER_PAID'], handler);
  }
];

export default initRoutes;