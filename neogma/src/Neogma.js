"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neogma = void 0;
const neo4j_driver = __importStar(require("neo4j-driver"));
const QueryRunner_1 = require("./Queries/QueryRunner");
const Sessions_1 = require("./Sessions/Sessions");
const neo4j = neo4j_driver;
class Neogma {
    /**
     *
     * @param {ConnectParamsI} params - the connection params
     * @param {ConnectOptionsI} options - additional options for the QueryRunner
     */
    constructor(params, options) {
        /** a map between each Model's modelName and the Model itself */
        this.modelsByName = {};
        this.getSession = (runInSession, callback) => {
            return Sessions_1.getSession(runInSession, callback, this.driver);
        };
        this.getTransaction = (runInTransaction, callback) => {
            return Sessions_1.getTransaction(runInTransaction, callback, this.driver);
        };
        this.getRunnable = (runInExisting, callback) => {
            return Sessions_1.getRunnable(runInExisting, callback, this.driver);
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
        this.queryRunner = new QueryRunner_1.QueryRunner({
            driver: this.driver,
            logger: options === null || options === void 0 ? void 0 : options.logger,
        });
    }
}
exports.Neogma = Neogma;
//# sourceMappingURL=Neogma.js.map