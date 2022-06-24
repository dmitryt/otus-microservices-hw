import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import client from 'prom-client';

const register = new client.Registry();

register.setDefaultLabels({
  app: 'otus-users-app'
});

client.collectDefaultMetrics({ register });

const httpMetricsRequestCount = new client.Counter({
  name: 'http_request_count',
  help: 'Application Request Count',
  labelNames: ['method', 'endpoint', 'http_status'],
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpMetricsRequestCount);

const routes = async (app: FastifyInstance) => {
  app.get('/', {
    handler: async (req: FastifyRequest<any>, res: FastifyReply) => {
      res.header('Content-Type', register.contentType);
      res.send(register.metrics());
    }
  });
};

export default routes;