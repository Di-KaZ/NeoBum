import { Where, WhereParamsByIdentifierI, WhereParamsI } from '../Where';
import { Neo4jSupportedProperties, NeogmaModel } from '../..';
/** returns the given type, while making the given properties required */
declare type RequiredProperties<T, P extends keyof T> = T & {
    [key in P]-?: Required<NonNullable<T[key]>>;
};
export declare type ParameterI = RawI | MatchI | CreateI | MergeI | SetI | DeleteI | RemoveI | ReturnI | OrderByI | UnwindI | ForEachI | LimitI | SkipI | WithI | WhereI | null | undefined;
/** raw string to be used as is in the query */
export declare type RawI = {
    /** will used as is in the query */
    raw: string;
};
export declare const isRawParameter: (param: ParameterI) => param is RawI;
/** MATCH parameter */
export declare type MatchI = {
    /** MATCH parameter */
    match: string | MatchNodeI | MatchRelatedI | MatchMultipleI | MatchLiteralI;
};
export declare const isMatchParameter: (param: ParameterI) => param is MatchI;
/** matching a single node */
export declare type MatchNodeI = NodeForMatchI & {
    /** optional match */
    optional?: boolean;
};
/** matching a combination of related nodes and relationships */
export declare type MatchRelatedI = {
    /** combination of related nodes and relationships */
    related: Array<NodeForMatchI | RelationshipForMatchI>;
    /** optional match */
    optional?: boolean;
};
export declare const isMatchRelated: (param: MatchI['match']) => param is MatchRelatedI;
/** matching multiple nodes */
export declare type MatchMultipleI = {
    /** multiple nodes */
    multiple: NodeForMatchI[];
    /** optional match */
    optional?: boolean;
};
export declare const isMatchMultiple: (param: MatchI['match']) => param is MatchMultipleI;
/** a literal string for matching */
export declare type MatchLiteralI = {
    /** literal string */
    literal: string;
    /** optional match */
    optional?: string;
};
export declare const isMatchLiteral: (param: MatchI['match']) => param is MatchLiteralI;
/** CREATE parameter */
export declare type CreateI = {
    /** CREATE parameter */
    create: string | CreateNodeI | CreateRelatedI | CreateMultipleI;
};
export declare const isCreateParameter: (param: ParameterI) => param is CreateI;
/** creating a node */
export declare type CreateNodeI = NodeForCreateI;
/** creating a combination of related nodes and relationships */
export declare type CreateRelatedI = {
    /** combination of related nodes and relationships */
    related: Array<Partial<NodeForCreateI> | RelationshipForCreateI>;
};
export declare const isCreateRelated: (param: CreateI['create']) => param is CreateRelatedI;
/** creating multiple nodes */
export declare type CreateMultipleI = {
    /** multiple nodes */
    multiple: NodeForCreateI[];
};
export declare const isCreateMultiple: (param: CreateI['create']) => param is CreateMultipleI;
/** MERGE parameter. Using the same types as CREATE */
export declare type MergeI = {
    /** MERGE parameter. Using the same types as CREATE */
    merge: string | CreateNodeI | CreateRelatedI | CreateMultipleI;
};
export declare const isMergeParameter: (param: ParameterI) => param is MergeI;
/** DELETE parameter */
export declare type DeleteI = {
    /** DELETE parameter */
    delete: string | DeleteByIdentifierI | DeleteLiteralI;
};
export declare const isDeleteParameter: (param: ParameterI) => param is DeleteI;
/** deletes the given identifiers */
export declare type DeleteByIdentifierI = {
    /** identifiers to be deleted */
    identifiers: string | string[];
    /** detach delete */
    detach?: boolean;
};
export declare const isDeleteWithIdentifier: (_param: DeleteI['delete']) => _param is DeleteByIdentifierI;
/** deletes by using the given literal */
export declare type DeleteLiteralI = {
    /** delete literal */
    literal: string;
    /** detach delete */
    detach?: boolean;
};
export declare const isDeleteWithLiteral: (_param: DeleteI['delete']) => _param is DeleteLiteralI;
/** SET parameter */
export declare type SetI = {
    /** SET parameter */
    set: string | SetObjectI;
};
export declare const isSetParameter: (param: ParameterI) => param is SetI;
export declare type SetObjectI = {
    /** identifier whose properties will be set */
    identifier: string;
    /** properties to set */
    properties: Neo4jSupportedProperties;
};
export declare type RemoveI = {
    remove: string | RemovePropertiesI | RemoveLabelsI;
};
export declare const isRemoveParameter: (param: ParameterI) => param is RemoveI;
/** removes properties of an identifier */
export declare type RemovePropertiesI = {
    /** identifier whose properties will be removed */
    identifier: string;
    /** properties to remove */
    properties: string | string[];
};
export declare const isRemoveProperties: (_param: RemoveI['remove']) => _param is RemovePropertiesI;
/** removes labels of an identifier */
export declare type RemoveLabelsI = {
    /** identifier whose labels will be removed */
    identifier: string;
    /** labels to remove */
    labels: string | string[];
};
export declare const isRemoveLabels: (_param: RemoveI['remove']) => _param is RemoveLabelsI;
/** RETURN parameter */
export declare type ReturnI = {
    /** RETURN parameter */
    return: string | string[] | ReturnObjectI;
};
export declare const isReturnParameter: (param: ParameterI) => param is ReturnI;
export declare type ReturnObjectI = Array<{
    /** identifier to return */
    identifier: string;
    /** returns only this property of the identifier */
    property?: string;
}>;
export declare const isReturnObject: (param: ReturnI['return']) => param is ReturnObjectI;
/** LIMIT parameter */
export declare type LimitI = {
    limit: string | number;
};
export declare const isLimitParameter: (limit: ParameterI) => limit is LimitI;
/** SKIP parameter */
export declare type SkipI = {
    skip: string | number;
};
export declare const isSkipParameter: (skip: ParameterI) => skip is SkipI;
/** WITH parameter */
export declare type WithI = {
    with: string | string[];
};
export declare const isWithParameter: (wth: ParameterI) => wth is WithI;
/** ORDER BY parameter */
export declare type OrderByI = {
    orderBy: string | Array<string | [string, 'ASC' | 'DESC'] | OrderByObjectI> | OrderByObjectI;
};
export declare type OrderByObjectI = {
    /** identifier to order */
    identifier: string;
    /** only order this property of the identifier */
    property?: string;
    /** direction of this order */
    direction?: 'ASC' | 'DESC';
};
export declare const isOrderByParameter: (orderBy: ParameterI) => orderBy is OrderByI;
/** UNWIND parameter */
export declare type UnwindI = {
    /** UNWIND parameter */
    unwind: string | UnwindObjectI;
};
export declare type UnwindObjectI = {
    /** value to unwind */
    value: string;
    /** unwind value as this */
    as: string;
};
export declare const isUnwindParameter: (unwind: ParameterI) => unwind is UnwindI;
/** WHERE parameter */
export declare type WhereI = {
    /** WHERE parameter */
    where: string | Where | WhereParamsByIdentifierI;
};
export declare const isWhereParameter: (where: ParameterI) => where is WhereI;
/** FOR EACH parameter */
export declare type ForEachI = {
    /** FOR EACH parameter */
    forEach: string;
};
export declare const isForEachParameter: (forEach: ParameterI) => forEach is ForEachI;
/** node type which will be used for matching */
export declare type NodeForMatchI = string | NodeForMatchObjectI;
export declare type NodeForMatchObjectI = {
    /** a label to use for this node */
    label?: string;
    /** the model of this node. Automatically sets the "label" field */
    model?: NeogmaModel<any, any, any, any>;
    /** identifier for the node */
    identifier?: string;
    /** where parameters for matching this node */
    where?: WhereParamsI;
};
/** node type which will be used for creating/merging */
export declare type NodeForCreateI = string | NodeForCreateWithLabelI | NodeForCreateWithModelI;
export declare type NodeForCreateObjectI = NodeForCreateWithLabelI | NodeForCreateWithModelI;
/** node type used for creating/merging, using a label */
export declare type NodeForCreateWithLabelI = {
    /** identifier for the node */
    identifier?: string;
    /** a label to use for this node */
    label: string;
    /** properties of the node */
    properties?: Neo4jSupportedProperties;
};
/** node type used for creating/merging, using a model to extract the label */
export declare type NodeForCreateWithModelI = {
    /** identifier for the node */
    identifier?: string;
    /** the model of this node. Automatically sets the "label" field */
    model: NeogmaModel<any, any, any, any>;
    /** properties of the node */
    properties?: Neo4jSupportedProperties;
};
export declare const isNodeWithWhere: (node: NodeForMatchObjectI | NodeForCreateObjectI) => node is RequiredProperties<NodeForMatchObjectI, "where">;
export declare const isNodeWithLabel: (node: NodeForMatchObjectI | NodeForCreateObjectI) => node is NodeForCreateWithLabelI;
export declare const isNodeWithModel: (node: NodeForMatchObjectI | NodeForCreateObjectI) => node is NodeForCreateWithModelI;
export declare const isNodeWithProperties: (node: NodeForMatchObjectI | NodeForCreateObjectI) => node is RequiredProperties<NodeForCreateObjectI, "properties">;
/** relationship type used for matching */
export declare type RelationshipForMatchI = string | RelationshipForMatchObjectI;
export declare type RelationshipForMatchObjectI = {
    /** direction of this relationship, from top to bottom */
    direction: 'in' | 'out' | 'none';
    /** name of this relationship */
    name?: string;
    /** identifier for this relationship */
    identifier?: string;
    /** where parameters for matching this relationship */
    where?: WhereParamsI;
};
/** relationship type used for creating/merging */
export declare type RelationshipForCreateI = string | RelationshipForCreateObjectI;
export declare type RelationshipForCreateObjectI = {
    /** direction of this relationship, from top to bottom */
    direction: 'in' | 'out' | 'none';
    /** name of this relationship */
    name: string;
    /** identifier for this relationship */
    identifier?: string;
    /** properties of the relationship */
    properties?: Neo4jSupportedProperties;
};
export declare const isRelationshipWithWhere: (relationship: RelationshipForMatchObjectI | RelationshipForCreateObjectI) => relationship is RequiredProperties<RelationshipForMatchObjectI, "where">;
export declare const isRelationshipWithProperties: (relationship: RelationshipForMatchObjectI | RelationshipForCreateObjectI) => relationship is RequiredProperties<RelationshipForCreateObjectI, "properties">;
export declare const isRelationship: (_relationship: RelationshipForMatchI | NodeForMatchI) => _relationship is RelationshipForMatchI;
export {};
