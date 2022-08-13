import { FastifyInstance } from 'fastify';
import config from './config';
import BalanceModel from './models/balance';

const { queues } = config.amqp;

const init = (app: FastifyInstance) => ({
  [queues.users]: {
    USER_CREATED: async ({ userId }: { userId: string }) => {
      const model = new BalanceModel(app.pg, app.log);
      return model.create({ balance: 0, user_id: userId });
    },
  },
});

export type IAmqpHandlers = {
  [key: string]: (msg: any) => Promise<any>,
};

export default init;