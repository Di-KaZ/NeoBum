import * as neo4j_driver from 'neo4j-driver';
import { QueryRunner } from './Queries/QueryRunner';
import { getRunnable, getSession, getTransaction } from './Sessions/Sessions';
const neo4j = neo4j_driver;
export class Neogma {
    /**
     *
     * @param {ConnectParamsI} params - the connection params
     * @param {ConnectOptionsI} options - additional options for the QueryRunner
     */
    constructor(params, options) {
        /** a map between each Model's modelName and the Model itself */
        this.modelsByName = {};
        this.getSession = (runInSession, callback) => {
            return getSession(runInSession, callback, this.driver);
        };
        this.getTransaction = (runInTransaction, callback) => {
            return getTransaction(runInTransaction, callback, this.driver);
        };
        this.getRunnable = (runInExisting, callback) => {
            return getRunnable(runInExisting, callback, this.driver);
        };
        const { url, username, password } = params;
        try {
            this.driver = neo4j.driver(url, neo4j.auth.basic(username, password), options);
        }
        catch (err) {
            console.error(`Error while connecting to the neo4j database`);
            console.error(err);
            process.exit(-1);
        }
        this.queryRunner = new QueryRunner({
            driver: this.driver,
            logger: options === null || options === void 0 ? void 0 : options.logger,
        });
    }
}
//# sourceMappingURL=Neogma.js.map