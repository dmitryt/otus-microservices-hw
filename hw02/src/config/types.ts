interface IDBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  dbName: string;
}

export interface IConfig {
  host: string;
  port: number;
  db: IDBConfig;
}