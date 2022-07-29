interface IDBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  dbName: string;
}

export interface IConfig {
  secret: string;
  host: string;
  port: number;
  db: IDBConfig;
}