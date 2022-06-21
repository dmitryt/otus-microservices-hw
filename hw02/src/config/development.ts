import { IConfig } from './types';

const cfg: IConfig = {
  host: 'localhost',
  port: 8000,

  db: {
    host: 'localhost',
    port: 5433,
    user: 'hw02_user',
    pass: 'hw02_pass',
    dbName: 'hw02',
  },
};

export default cfg;