import FastifyAmqp from 'fastify-amqp';
import { FastifyInstance } from 'fastify';

import initAmqpRoutes, { IAmqpHandlers } from '../amqp-routes';
import config from '../config';

const subscribeToQueue = (app: FastifyInstance, queueName: string, handlers: IAmqpHandlers) => {
  const { channel } = app.amqp;
  channel.assertQueue(queueName, {
    durable: false
  });
  channel.prefetch(1);

  channel.consume(queueName, async (msg: any) => {
    app.log.debug(`Received in "${queueName}": "${msg.content.toString()}"`);
    const { eventType, payload } = JSON.parse(msg.content.toString());
    const handler = handlers[eventType];
    app.log.debug(`EVENT TYPE ${eventType}, handler ${handler}`);
    if (typeof handler === 'function') {
      const result = await handler(payload);
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(result)),
        { correlationId: msg.properties.correlationId },
      );
      channel.ack(msg);
    }
  });
};

const init = async (app: FastifyInstance) => {
  const {user, pass, host, port, vhost } = config.amqp || {};
  await app.register(FastifyAmqp, {
    hostname: host,
    port,
    username: user,
    password: pass,
    vhost
  });

  const amqpRoutes = initAmqpRoutes(app);
  for (const [queueName, handlers] of Object.entries(amqpRoutes)) {
    subscribeToQueue(app, queueName, handlers);
  }
};

export default init;