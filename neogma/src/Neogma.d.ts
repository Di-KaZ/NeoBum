import { Config, Driver, Session, Transaction } from 'neo4j-driver/types';
import { NeogmaModel } from './ModelOps';
import { QueryRunner, Runnable } from './Queries/QueryRunner';
interface ConnectParamsI {
  url: string;
  username: string;
  password: string;
}
interface ConnectOptionsI extends Config {
  /** whether to log the statements and parameters to the console */
  logger?: QueryRunner['logger'];
}
export declare class Neogma {
  readonly driver: Driver;
  readonly queryRunner: QueryRunner;
  /** a map between each Model's modelName and the Model itself */
  modelsByName: Record<string, NeogmaModel<any, any, any, any>>;
  /**
   *
   * @param {ConnectParamsI} params - the connection params
   * @param {ConnectOptionsI} options - additional options for the QueryRunner
   */
  constructor(params: ConnectParamsI, options?: ConnectOptionsI);
  getSession: <T>(runInSession: Session | null, callback: (s: Session) => Promise<T>) => Promise<T>;
  getTransaction: <T>(
    runInTransaction: Runnable | null,
    callback: (tx: Transaction) => Promise<T>
  ) => Promise<T>;
  getRunnable: <T>(
    runInExisting: Runnable | null,
    callback: (tx: Runnable) => Promise<T>
  ) => Promise<T>;
}
export { Neogma };
