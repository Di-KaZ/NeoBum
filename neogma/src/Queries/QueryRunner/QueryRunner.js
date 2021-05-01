var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as uuid from 'uuid';
import { getRunnable } from '../../Sessions';
import { Where } from '../Where/Where';
import { trimWhitespace } from '../../utils/string';
import { QueryBuilder } from '../QueryBuilder';
export class QueryRunner {
    constructor(params) {
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            const { label, data: options } = params;
            const identifier = params.identifier || QueryRunner.identifiers.default;
            const queryBuilder = new QueryBuilder()
                .unwind('{options} as data')
                .create({
                identifier,
                label,
            })
                .set(`${identifier} += data`)
                .return(identifier);
            // we won't use the queryBuilder bindParams as we've used "options" as a literal
            const parameters = { options };
            return this.run(queryBuilder.getStatement(), parameters, params.session);
        });
        this.update = (params) => __awaiter(this, void 0, void 0, function* () {
            const { label } = params;
            const data = params.data;
            const identifier = params.identifier || QueryRunner.identifiers.default;
            const where = Where.acquire(params.where);
            const queryBuilder = new QueryBuilder(
            /* clone the where bind param and construct one for the update, as there might be common keys between where and data */
            where === null || 
            /* clone the where bind param and construct one for the update, as there might be common keys between where and data */
            where === void 0 ? void 0 : 
            /* clone the where bind param and construct one for the update, as there might be common keys between where and data */
            where.getBindParam().clone());
            queryBuilder.match({
                identifier,
                label,
            });
            if (where) {
                queryBuilder.where(where);
            }
            queryBuilder.set({
                identifier,
                properties: data,
            });
            if (params.return) {
                queryBuilder.return(identifier);
            }
            return queryBuilder.run(this, params.session);
        });
        this.delete = (params) => __awaiter(this, void 0, void 0, function* () {
            const { label, detach } = params;
            const where = Where.acquire(params.where);
            const identifier = params.identifier || QueryRunner.identifiers.default;
            const queryBuilder = new QueryBuilder(where === null || where === void 0 ? void 0 : where.getBindParam());
            queryBuilder.match({
                identifier,
                label,
            });
            if (where) {
                queryBuilder.where(where);
            }
            queryBuilder.delete({
                identifiers: identifier,
                detach,
            });
            return queryBuilder.run(this, params.session);
        });
        this.createRelationship = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { source, target, relationship } = params;
            const where = Where.acquire(params.where);
            const relationshipIdentifier = 'r';
            const identifiers = {
                source: source.identifier ||
                    QueryRunner.identifiers.createRelationship.source,
                target: target.identifier ||
                    QueryRunner.identifiers.createRelationship.target,
            };
            const queryBuilder = new QueryBuilder((_a = 
            /** the params of the relationship value */
            where === null || 
            /** the params of the relationship value */
            where === void 0 ? void 0 : 
            /** the params of the relationship value */
            where.getBindParam()) === null || _a === void 0 ? void 0 : _a.clone());
            queryBuilder.match({
                multiple: [
                    {
                        identifier: identifiers.source,
                        label: source.label,
                    },
                    {
                        identifier: identifiers.target,
                        label: target.label,
                    },
                ],
            });
            if (where) {
                queryBuilder.where(where);
            }
            queryBuilder.create({
                related: [
                    {
                        identifier: identifiers.source,
                    },
                    {
                        direction: relationship.direction,
                        name: relationship.name,
                        identifier: relationshipIdentifier,
                    },
                    {
                        identifier: identifiers.target,
                    },
                ],
            });
            const relationshipProperties = params.relationship.properties;
            if (relationshipProperties &&
                Object.keys(relationshipProperties).length) {
                /** the relationship properties statement to be inserted into the final statement string */
                queryBuilder.set({
                    identifier: relationshipIdentifier,
                    properties: relationshipProperties,
                });
            }
            return queryBuilder.run(this, params.session);
        });
        /** maps a session object to a uuid, for logging purposes */
        this.sessionIdentifiers = new WeakMap([]);
        this.driver = params.driver;
        this.logger = (params === null || params === void 0 ? void 0 : params.logger) || null;
    }
    getDriver() {
        return this.driver;
    }
    log(...val) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.call(this, ...val);
    }
    /** runs a statement */
    run(
    /** the statement to run */
    statement, 
    /** parameters for the query */
    parameters, 
    /** the session or transaction for running this query */
    existingSession) {
        return getRunnable(existingSession, (session) => __awaiter(this, void 0, void 0, function* () {
            parameters = parameters || {};
            /** an identifier to be used for logging purposes */
            let sessionIdentifier = 'Default';
            const existingSessionIdentifier = this.sessionIdentifiers.get(session);
            if (existingSessionIdentifier) {
                sessionIdentifier = existingSessionIdentifier;
            }
            else {
                sessionIdentifier = uuid.v4();
                this.sessionIdentifiers.set(session, sessionIdentifier);
            }
            const trimmedStatement = trimWhitespace(statement);
            this.log(sessionIdentifier);
            this.log(`\tStatement:`, trimmedStatement);
            this.log(`\tParameters:`, parameters);
            return session.run(trimmedStatement, parameters);
        }), this.driver);
    }
}
/** default identifiers for the queries */
QueryRunner.identifiers = {
    /** general purpose default identifier */
    default: 'nodes',
    /** default identifiers for createRelationship */
    createRelationship: {
        /** default identifier for the source node */
        source: 'source',
        /** default identifier for the target node */
        target: 'target',
    },
};
QueryRunner.getResultProperties = (result, identifier) => {
    return result.records.map((v) => v.get(identifier).properties);
};
QueryRunner.getNodesDeleted = (result) => {
    return result.summary.counters.updates().nodesDeleted;
};
//# sourceMappingURL=QueryRunner.js.map