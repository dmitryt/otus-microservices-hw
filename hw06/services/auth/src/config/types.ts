interface IDBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  dbName: string;
}

interface IAmqpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  queues: {
    [key: string]: string;
  };
  vhost?: string;
}

export interface IConfig {
  secret: string;
  host: string;
  port: number;
  db: IDBConfig;
  amqp: IAmqpConfig;
}