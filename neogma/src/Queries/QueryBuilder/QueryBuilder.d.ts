import { QueryResult } from 'neo4j-driver/types';
import { BindParam } from '../BindParam';
import { Where } from '../Where';
import { QueryRunner, Runnable, Neo4jSupportedProperties } from '../QueryRunner';
import { ParameterI, MatchI, RawI, CreateI, SetI, DeleteI, RemoveI, ReturnI, LimitI, WithI, MergeI, UnwindI, OrderByI, ForEachI, SkipI, WhereI } from './QueryBuilder.types';
declare type AnyObject = Record<string, any>;
export declare type QueryBuilderParameters = {
    ParameterI: ParameterI;
    RawI: RawI['raw'];
    MatchI: MatchI['match'];
    CreateI: CreateI['create'];
    MergeI: MergeI['merge'];
    SetI: SetI['set'];
    DeleteI: DeleteI['delete'];
    RemoveI: RemoveI['remove'];
    ReturnI: ReturnI['return'];
    LimitI: LimitI['limit'];
    WithI: WithI['with'];
    OrderByI: OrderByI['orderBy'];
    UnwindI: UnwindI['unwind'];
    ForEachI: ForEachI['forEach'];
    SkipI: SkipI['skip'];
    WhereI: WhereI['where'];
};
export declare class QueryBuilder {
    /** a queryRunner instance can be set to always be used at the 'run' method */
    static queryRunner: QueryRunner;
    /** parameters for the query to be generated */
    private parameters;
    /** the statement for the query */
    private statement;
    /** the bind parameters for the query */
    private bindParam;
    constructor(
    /** an existing bindParam to be used */
    bindParam?: BindParam);
    addParams(
    /** parameters for the query */
    parameters: ParameterI | ParameterI[], ...restParameters: ParameterI[]): QueryBuilder;
    /** get the generated statement for the query */
    getStatement(): QueryBuilder['statement'];
    /** get the bind parameter for the query */
    getBindParam(): QueryBuilder['bindParam'];
    /** generates the statement by using the parameters and the bindParam */
    private setStatementByParameters;
    private getNodeString;
    private getRelationshipString;
    /** returns a string in the format `MATCH (a:Node) WHERE a.p1 = $v1` */
    private getMatchString;
    private getCreateOrMergeString;
    /** returns a string in the format: `SET a.p1 = $v1, a.p2 = $v2` */
    private getSetString;
    private getDeleteString;
    private getRemoveString;
    private getReturnString;
    private getLimitString;
    private getSkipString;
    private getWithString;
    private getUnwindString;
    private getForEachString;
    private getOrderByString;
    private getWhereString;
    /**
     * surrounds the label with backticks to also allow spaces
     * @param label - the label to use
     * @param operation - defaults to 'and'. Whether to generate a "and" or an "or" operation for the labels
     */
    static getNormalizedLabels: (label: string | string[], operation?: "and" | "or" | undefined) => string;
    /**
     * returns a string to be used in a query, regardless if any of the identifier or label are null
     */
    static getIdentifierWithLabel: (identifier?: string | undefined, label?: string | undefined) => string;
    /**
     * returns the appropriate string for a node, ready to be put in a statement
     * example: (ident: Label { a.p1: $v1 })
     */
    static getNodeStatement: ({ identifier, label, inner, }: {
        /** identifier for the node */
        identifier?: string | undefined;
        /** identifier for the label */
        label?: string | undefined;
        /** a statement to be used inside the node, like a where condition or properties */
        inner?: string | Where | {
            properties: Neo4jSupportedProperties;
            bindParam: BindParam;
        } | undefined;
    }) => string;
    /**
     * returns the appropriate string for a relationship, ready to be put in a statement
     * example: -[identifier: name {where}]->
     */
    static getRelationshipStatement: (params: {
        /** relationship direction */
        direction: 'in' | 'out' | 'none';
        /** relationship name */
        name?: string;
        /** relationship identifier. If empty, no identifier will be used */
        identifier?: string;
        /** a statement to be used inside the relationship, like a where condition or properties */
        inner?: string | Where | {
            properties: Neo4jSupportedProperties;
            bindParam: BindParam;
        };
    }) => string;
    /** returns the parts and the statement for a SET operation with the given params */
    static getSetParts: (params: {
        /** data to set */
        data: AnyObject;
        /** bind param to use */
        bindParam: BindParam;
        /** identifier to use */
        identifier: string;
    }) => {
        parts: string[];
        statement: string;
    };
    /**
     * returns an object with replacing its values with a bind param value
     * example return value: ( a.p1 = $v1, b.p2 = $v2 )
     */
    static getPropertiesWithParams: (data: AnyObject, bindParam: BindParam) => string;
    /** runs this instance with the given QueryRunner instance */
    run(
    /** the QueryRunner instance to use */
    queryRunnerOrRunnable?: QueryRunner | Runnable | null, 
    /** an existing session to use. Set it only if the first param is a QueryRunner instance */
    existingSession?: Runnable | null): Promise<QueryResult>;
    /** a literal statement to use as is */
    raw(raw: RawI['raw']): QueryBuilder;
    /** MATCH statement */
    match(match: MatchI['match']): QueryBuilder;
    /** CREATE statement */
    create(create: CreateI['create']): QueryBuilder;
    /** MERGE statement */
    merge(merge: MergeI['merge']): QueryBuilder;
    /** SET statement */
    set(set: SetI['set']): QueryBuilder;
    /** DELETE statement */
    delete(deleteParam: DeleteI['delete']): QueryBuilder;
    /** REMOVE statement */
    remove(remove: RemoveI['remove']): QueryBuilder;
    /** RETURN statement */
    return(returnParam: ReturnI['return']): QueryBuilder;
    /** LIMIT statement */
    limit(limit: LimitI['limit']): QueryBuilder;
    /** WITH statement */
    with(withParam: WithI['with']): QueryBuilder;
    /** ORDER BY statement */
    orderBy(orderBy: OrderByI['orderBy']): QueryBuilder;
    /** UNWIND statement */
    unwind(unwind: UnwindI['unwind']): QueryBuilder;
    /** FOR EACH statement */
    forEach(forEach: ForEachI['forEach']): QueryBuilder;
    /** SKIP statement */
    skip(skip: SkipI['skip']): QueryBuilder;
    /** WHERE statement */
    where(where: WhereI['where']): QueryBuilder;
}
export {};
