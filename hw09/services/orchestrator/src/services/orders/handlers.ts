import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import config from '../../config';
import { sendToQueue } from '../../utils';

import { SagaBuilder, SagaSender } from '../../utils/saga-builder';

const sagaSender = new SagaSender();
const ordersSaga = new SagaBuilder(sagaSender)
  .step('Order Create', 'orders', true)
  .step('Payment Reserve', 'payments', true)
  .step('Item Reserve', 'items', true)
  .step('Delivery Reserve', 'deliveries', true)

export const createOrderRequest = (app: FastifyInstance) => async (req: FastifyRequest<any>, res: FastifyReply) => {
  const { queues } = config.amqp;
  const payload = { name: 'ORDER_CREATE', type: 'REQUEST', data: req.body, }
  const result = await sendToQueue(app, queues.incomingOrders, payload, true);
  res.send(result);
};

export const processOrdersRequestHandler = (app: FastifyInstance) => async (data: any) => {
  const { correlationId, replyTo, ...rest } = data;
  await ordersSaga.execute(rest);
  const payload = {
    name: 'ORDER_CREATE',
    type: 'SUCCESS',
    data: {hello: "world"},
    correlationId,
  }
  await sendToQueue(app, replyTo, payload);
};