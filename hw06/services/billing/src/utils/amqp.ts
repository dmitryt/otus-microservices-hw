import { FastifyInstance } from 'fastify';

export const subscribeToQueue = (app: FastifyInstance, queueName: string, handler: (p: any, o?: any) => Promise<any>) => {
  const { channel } = app.amqp;
  channel.assertQueue(queueName, {
    durable: false
  });
  channel.prefetch(1);

  channel.consume(queueName, async (msg: any) => {
    app.log.debug(`Received in "${queueName}": "${msg.content.toString()}"`);
    const { eventType, payload } = JSON.parse(msg.content.toString());
    app.log.debug(`EVENT TYPE ${eventType}`);
    const options = { correlationId: msg.properties.correlationId };
    const result = await handler(payload, options);
    if (msg.properties.replyTo) {
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(result)),
        { correlationId: msg.properties.correlationId },
      );
    }
    channel.ack(msg);
  });
};

export const subscribeToExchange = async (
  app: FastifyInstance,
  exchange: string,
  types: string[],
  handler: (p: any, o?: any) => void,
) => {
  const { channel } = app.amqp;
  channel.assertExchange(exchange, 'direct', {
    durable: false
  });

  const assertion = await channel.assertQueue('', {
    exclusive: true
  });

  if (assertion) {
    const { queue } = assertion;

    types.forEach((type) => {
      channel.bindQueue(queue, exchange, type);
    });

    channel.consume(queue, (msg: any) => {
      app.log.debug(`Incoming message: ${msg.content.toString()}`);
      handler(JSON.parse(msg.content.toString()), { correlationId: msg.properties.correlationId })
    }, {
      noAck: true
    });
  }
};

export const sendToExchange = (
  app: FastifyInstance,
  exchange: string,
  type: string,
  payload: any,
) => {
  const { channel } = app.amqp;
  channel.assertExchange(exchange, 'direct', {
    durable: false
  });
  channel.publish(
    exchange,
    type,
    Buffer.from(JSON.stringify(payload)),
  );
}