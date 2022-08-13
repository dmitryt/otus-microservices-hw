import { IConfig } from './types';

const cfg: IConfig = {
  secret: 'devsecretdevsecretdevsecretdevsecretdevsecretdevsecret',
  host: 'localhost',
  port: 8003,

  db: {
    host: 'localhost',
    port: 5433,
    user: 'hw02user',
    pass: 'hw02pass',
    dbName: 'hw02',
  },
  amqp: {
    host: 'localhost',
    port: 5672,
    user: 'hw06user',
    pass: 'hw06pass',
    vhost: '',
    queues: {
      users: 'users',
      orders: 'orders',
    },
  },
};

export default cfg;