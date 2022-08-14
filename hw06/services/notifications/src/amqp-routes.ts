import config from './config';
import { FastifyInstance } from './plugins';

const { queues } = config.amqp;

type IOrderPayload = { orderId: number, status: string, error?: string };

const init = (app: FastifyInstance) => ({
  [queues.orders]: {
    ORDER_PAID: async ({ orderId, status, error }: IOrderPayload ) => {
      const genMessage = () => {
        if (status === 'success') {
          return `Order ${orderId} was paid successfully`;
        }
        return `There was a following error during paying for the order ${orderId}: ${error}`;
      };
      await app.knex!('notifications').insert({ order_id: orderId, message: genMessage() });
    },
  },
});

export type IAmqpHandlers = {
  [key: string]: ((msg: any, options: any) => Promise<any>) | undefined,
};

export default init;