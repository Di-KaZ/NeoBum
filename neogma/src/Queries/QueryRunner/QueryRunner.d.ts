import { Driver, QueryResult, Session, Transaction, DateTime as Neo4jDateTime, Date as Neo4jDate, Point as Neo4jPoint, Time as Neo4jTime, Integer as Neo4jInteger, LocalDateTime as Neo4jLocalDateTime, LocalTime as Neo4jLocalTime, Duration as Neo4jDuration } from 'neo4j-driver/types';
import { AnyWhereI, Where } from '../Where/Where';
declare type AnyObject = Record<string, any>;
/** the single types that Neo4j supports (not including an array of them) */
export declare type Neo4jSingleTypes = number | Neo4jInteger | string | boolean | Neo4jPoint | Neo4jDate | Neo4jTime | Neo4jLocalTime | Neo4jDateTime | Neo4jLocalDateTime | Neo4jDuration;
/** all the types that Neo4j supports (single or array) */
export declare type Neo4jSupportedTypes = Neo4jSingleTypes | Neo4jSingleTypes[];
export declare type Neo4jSupportedProperties = Record<string, Neo4jSupportedTypes | undefined>;
/** can run queries, is either a Session or a Transaction */
export declare type Runnable = Session | Transaction;
export interface CreateRelationshipParamsI {
    source: {
        label?: string;
        /** identifier to be used in the query. Defaults to the value of QueryRunner.identifiers.createRelationship.source */
        identifier?: string;
    };
    target: {
        label?: string;
        /** identifier to be used in the query. Defaults to the value of QueryRunner.identifiers.createRelationship.target */
        identifier?: string;
    };
    relationship: {
        name: string;
        direction: 'out' | 'in' | 'none';
        /** properties to be set as relationship attributes */
        properties?: AnyObject;
    };
    /** can access query identifiers by setting the "identifier" property of source/target, else by the values of QueryRunner.identifiers.createRelationship */
    where?: AnyWhereI;
    /** the session or transaction for running this query */
    session?: Runnable | null;
}
export declare class QueryRunner {
    private driver;
    /** whether to log the statements and parameters with the given function */
    private logger;
    constructor(params: {
        driver: QueryRunner['driver'];
        logger?: QueryRunner['logger'];
    });
    getDriver(): Driver;
    private log;
    create: <T>(params: {
        /** the label of the nodes to create */
        label: string;
        /** the data to create */
        data: T[];
        /** identifier for the nodes */
        identifier?: string | undefined;
        /** the session or transaction for running this query */
        session?: Transaction | Session | null | undefined;
    }) => Promise<QueryResult>;
    update: <T extends Record<string, string | number | boolean | Neo4jInteger | Neo4jPoint<Neo4jInteger> | Neo4jDate<Neo4jInteger> | Neo4jTime<Neo4jInteger> | Neo4jLocalTime<Neo4jInteger> | Neo4jDateTime<Neo4jInteger> | Neo4jLocalDateTime<Neo4jInteger> | Neo4jDuration<Neo4jInteger> | Neo4jSingleTypes[] | undefined>>(params: {
        /** the label of the nodes to create */
        label?: string | undefined;
        /** the where object for matching the nodes to be edited */
        data: Partial<T>;
        /** the new data data, to be edited */
        where?: import("../Where/Where").WhereParamsByIdentifierI | Where | undefined;
        /** identifier for the nodes */
        identifier?: string | undefined;
        /** whether to return the nodes */
        return?: boolean | undefined;
        /** the session or transaction for running this query */
        session?: Transaction | Session | null | undefined;
    }) => Promise<QueryResult>;
    delete: (params: {
        label?: string;
        where?: AnyWhereI;
        identifier?: string;
        /** detach relationships */
        detach?: boolean;
        /** the session or transaction for running this query */
        session?: Runnable | null;
    }) => Promise<QueryResult>;
    createRelationship: (params: CreateRelationshipParamsI) => Promise<QueryResult>;
    /** maps a session object to a uuid, for logging purposes */
    private sessionIdentifiers;
    /** runs a statement */
    run(
    /** the statement to run */
    statement: string, 
    /** parameters for the query */
    parameters?: Record<string, any>, 
    /** the session or transaction for running this query */
    existingSession?: Runnable | null): Promise<QueryResult>;
    /** default identifiers for the queries */
    static readonly identifiers: {
        /** general purpose default identifier */
        default: string;
        /** default identifiers for createRelationship */
        createRelationship: {
            /** default identifier for the source node */
            source: string;
            /** default identifier for the target node */
            target: string;
        };
    };
    static getResultProperties: <T>(result: QueryResult, identifier: string) => T[];
    static getNodesDeleted: (result: QueryResult) => number;
}
export {};
