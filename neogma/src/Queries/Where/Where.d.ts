import { BindParam } from '../BindParam/BindParam';
import { Neo4jSingleTypes, Neo4jSupportedTypes } from '../QueryRunner/QueryRunner';
/** symbols for Where operations */
declare const OpIn: unique symbol;
declare const OpContains: unique symbol;
export declare const Op: {
    readonly in: typeof OpIn;
    readonly contains: typeof OpContains;
};
/** the type to be used for "in" */
interface WhereInI {
    [Op.in]: Neo4jSingleTypes[];
}
interface WhereContainsI {
    [Op.contains]: string;
}
/** the type for the accepted values for an attribute */
export declare type WhereValuesI = Neo4jSupportedTypes | WhereInI | WhereContainsI;
/**
 * an object to be used for a query identifier
 * Its keys are the identifier attributes for the where, and the values are the values for that attribute
 */
export interface WhereParamsI {
    /** the attribute and values for an identifier */
    [attribute: string]: WhereValuesI;
}
/**
 * an object with the query identifiers as keys and the attributes+types as value
 */
export interface WhereParamsByIdentifierI {
    /** the identifiers to use */
    [identifier: string]: WhereParamsI;
}
/** a Where instance or the basic object which can create a Where instance */
export declare type AnyWhereI = WhereParamsByIdentifierI | Where;
export declare class Where {
    /** where bind params. Ensures that keys of the bind param are unique */
    private bindParam;
    /** all the given options, so we can easily combine them into a new statement */
    private rawParams;
    /**
     * an object with the key being the `identifier.property` and the value being the the bind param name which corresponds to it, and an operator to be used in the statement
     * this is needed for the following reasons:
     * 1) when generating the statement, those values are used
     * 2) the bind param names which are generated from this Where need to be differentiated from the actual keys of the bindParam, since this Where can only remove those
     */
    private identifierPropertyData;
    constructor(
    /** the where parameters to use */
    whereParams: Parameters<Where['addParams']>[0], 
    /** an existing bind param to be used, so the properties can be merged. If empty, a new one will be created and used */
    bindParam?: BindParam);
    /** gets the BindParam used in this Where */
    getBindParam(): BindParam;
    /** gets the raw where parameters used to generate the final result */
    getRawParams(): Where['rawParams'];
    /** refreshes the statement and the bindParams by the given where params */
    addParams(
    /** the where parameters to use */
    whereParams: WhereParamsByIdentifierI): Where;
    /** adds a value to the bind param, while updating the usedBindParamNames field appropriately */
    private addBindParamDataEntry;
    /** gets the statement by the params */
    getStatement: (mode: 'object' | 'text') => string;
    /** returns a Where object if params is specified, else returns null */
    static acquire(params?: AnyWhereI | null, bindParam?: BindParam): Where | null;
    /**
     * if the value is not an array, it gets returned as is. If it's an array, a "[Op.in]" object is returned for that value
     */
    static ensureIn(value: WhereValuesI): WhereValuesI;
}
export {};
