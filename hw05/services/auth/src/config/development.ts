import { IConfig } from './types';

const cfg: IConfig = {
  secret: 'devsecretdevsecretdevsecretdevsecretdevsecretdevsecret',
  host: 'localhost',
  port: 8002,

  db: {
    host: 'localhost',
    port: 5433,
    user: 'hw02user',
    pass: 'hw02pass',
    dbName: 'hw02',
  },
};

export default cfg;