import * as uuid from 'uuid';
import { getRunnable } from '../../Sessions';
import { Where } from '../Where/Where';
import { trimWhitespace } from '../../utils/string';
import { QueryBuilder } from '../QueryBuilder';
export class QueryRunner {
    constructor(params) {
        this.create = async (params) => {
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
        };
        this.update = async (params) => {
            const { label } = params;
            const data = params.data;
            const identifier = params.identifier || QueryRunner.identifiers.default;
            const where = Where.acquire(params.where);
            const queryBuilder = new QueryBuilder(
            /* clone the where bind param and construct one for the update, as there might be common keys between where and data */
            where?.getBindParam().clone());
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
        };
        this.delete = async (params) => {
            const { label, detach } = params;
            const where = Where.acquire(params.where);
            const identifier = params.identifier || QueryRunner.identifiers.default;
            const queryBuilder = new QueryBuilder(where?.getBindParam());
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
        };
        this.createRelationship = async (params) => {
            const { source, target, relationship } = params;
            const where = Where.acquire(params.where);
            const relationshipIdentifier = 'r';
            const identifiers = {
                source: source.identifier ||
                    QueryRunner.identifiers.createRelationship.source,
                target: target.identifier ||
                    QueryRunner.identifiers.createRelationship.target,
            };
            const queryBuilder = new QueryBuilder(
            /** the params of the relationship value */
            where?.getBindParam()?.clone());
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
        };
        /** maps a session object to a uuid, for logging purposes */
        this.sessionIdentifiers = new WeakMap([]);
        this.driver = params.driver;
        this.logger = params?.logger || null;
    }
    getDriver() {
        return this.driver;
    }
    log(...val) {
        this.logger?.(...val);
    }
    /** runs a statement */
    run(
    /** the statement to run */
    statement, 
    /** parameters for the query */
    parameters, 
    /** the session or transaction for running this query */
    existingSession) {
        return getRunnable(existingSession, async (session) => {
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
        }, this.driver);
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