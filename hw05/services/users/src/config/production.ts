import { IConfig } from './types';

const {
  HOST = '', PORT = '', DB_HOST = '', DB_PORT = '', DB_USER = '', DB_PASS = '', DB_NAME = '',
} = process.env;

const cfg: IConfig =  {
  secret: 'Uy8i8yNiO9ObofA$7a#yihKsHjkdSW4owyxRO6JMdV#9l&M%3@',
  host: HOST,
  port: parseInt(PORT, 10),
  db: {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    user: DB_USER,
    pass: DB_PASS,
    dbName: DB_NAME
  }
};

export default cfg;