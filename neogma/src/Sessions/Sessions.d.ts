import { Driver, Session, Transaction } from 'neo4j-driver/types';
import { Runnable } from '../Queries/QueryRunner';
/** runs the callback with a session. It closes it when the callback is done */
export declare const getSession: <T>(runInSession: Session | null, callback: (s: Session) => Promise<T>, driver: Driver) => Promise<T>;
/** runs the callback with a transaction. It closes it if the callback is successful, and rolls it back if not */
export declare const getTransaction: <T>(runInExisting: Runnable | null, callback: (tx: Transaction) => Promise<T>, driver: Driver) => Promise<T>;
/** runs the callback with a session or transaction. If any existing Runnable is given, it gets used. Else, a new Session is used */
export declare const getRunnable: <T>(runInExisting: Runnable | null | undefined, callback: (tx: Runnable) => Promise<T>, driver: Driver) => Promise<T>;
