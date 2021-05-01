/// <reference types="revalidator" />
import { QueryResult } from 'neo4j-driver';
import { Neogma } from '../Neogma';
import { Neo4jSupportedProperties } from '../Queries';
import { CreateRelationshipParamsI, Neo4jSupportedTypes, Runnable } from '../Queries/QueryRunner';
import { WhereParamsI } from '../Queries/Where';
declare type AnyObject = Record<string, any>;
/** the type of the properties to be added to a relationship */
export declare type RelationshipPropertiesI = Record<string, Neo4jSupportedTypes | undefined>;
interface GenericConfiguration {
    session?: Runnable | null;
}
/** used for defining the type of the RelatedNodesToAssociate interface, to be passed as the second generic to ModelFactory */
export interface ModelRelatedNodesI<
/** the type of the related model */
RelatedModel extends {
    createOne: NeogmaModelStaticsI<any>['createOne'];
}, 
/** the instance of the related model */
RelatedInstance, 
/** properties for the relationship */
CreateRelationshipProperties extends RelationshipPropertiesI = AnyObject, RelationshipProperties extends RelationshipPropertiesI = AnyObject> {
    /** interface of the data to create */
    CreateData: Parameters<RelatedModel['createOne']>[0] & Partial<CreateRelationshipProperties>;
    /** interface of the properties of the relationship used in create functions */
    CreateRelationshipProperties: CreateRelationshipProperties;
    /** interface of the actual properties of the relationship */
    RelationshipProperties: RelationshipProperties;
    /** the instance of the related model */
    Instance: RelatedInstance;
}
/** to be used in create functions where the related nodes can be passed for creation */
export declare type RelatedNodesCreationParamI<RelatedNodesToAssociateI extends AnyObject> = {
    [key in keyof Partial<RelatedNodesToAssociateI>]: RelationshipTypePropertyForCreateI<RelatedNodesToAssociateI[key]['CreateData'], RelatedNodesToAssociateI[key]['CreateRelationshipProperties']>;
};
/** the type to be used in RelationshipTypePropertyForCreateI.where */
declare type RelationshipTypePropertyForCreateWhereI<RelationshipProperties extends RelationshipPropertiesI> = {
    /** where for the target nodes */
    params: WhereParamsI;
    /** whether to merge instead of create the relationship */
    merge?: boolean;
    relationshipProperties?: Partial<RelationshipProperties>;
};
/** the type of the relationship along with the properties, so the proper relationship and/or nodes can be created */
declare type RelationshipTypePropertyForCreateI<Properties, RelationshipProperties extends RelationshipPropertiesI> = {
    /** create new nodes and create a relationship with them */
    properties?: Array<Properties & Partial<RelationshipProperties>>;
    /** configuration for merging instead of creating the properties/relationships */
    propertiesMergeConfig?: {
        /** merge the created nodes instead of creating them */
        nodes?: boolean;
        /** merge the relationship with the created properties instead of creating it */
        relationship?: boolean;
    };
    /** create a relationship with nodes which are matched by the where */
    where?: RelationshipTypePropertyForCreateWhereI<RelationshipProperties> | Array<RelationshipTypePropertyForCreateWhereI<RelationshipProperties>>;
};
/** the type for the Relationship configuration of a Model */
export declare type RelationshipsI<RelatedNodesToAssociateI extends AnyObject> = {
    [alias in keyof RelatedNodesToAssociateI]: {
        /** the related model. It could be the object of the model, or "self" for this model */
        model: NeogmaModel<any, any, any, any> | 'self';
        /** the name of the relationship */
        name: CreateRelationshipParamsI['relationship']['name'];
        /** the direction of the relationship */
        direction: 'out' | 'in' | 'none';
        /** relationship properties */
        properties?: {
            [relationshipPropertyAlias in keyof RelatedNodesToAssociateI[alias]['CreateRelationshipProperties']]: {
                /** the actual property to be used on the relationship */
                property: keyof RelatedNodesToAssociateI[alias]['RelationshipProperties'];
                /** validation for the property */
                schema: Revalidator.ISchema<AnyObject>;
            };
        };
    };
};
/** parameters when creating nodes */
declare type CreateDataParamsI = GenericConfiguration & {
    /** whether to merge instead of creating */
    merge?: boolean;
    /** validate all parent and children instances. default to true */
    validate?: boolean;
    /** the relationships which were created by a "where" param must equal to this number */
    assertRelationshipsOfWhere?: number;
};
/** type used for creating nodes. It includes their Properties and Related Nodes */
declare type CreateDataI<Properties, RelatedNodesToAssociateI extends AnyObject> = Properties & Partial<RelatedNodesCreationParamI<RelatedNodesToAssociateI>>;
/** the statics of a Neogma Model */
interface NeogmaModelStaticsI<Properties extends Neo4jSupportedProperties, RelatedNodesToAssociateI extends AnyObject = Object, MethodsI extends AnyObject = Object, CreateData = CreateDataI<Properties, RelatedNodesToAssociateI>, Instance = NeogmaInstance<Properties, RelatedNodesToAssociateI, MethodsI>> {
    prototype: MethodsI;
    relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>;
    addRelationships: (relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>) => void;
    getLabel: () => string;
    getRawLabels: () => string | string[];
    getPrimaryKeyField: () => string | null;
    getModelName: () => string;
    beforeCreate: (instance: Instance) => void;
    beforeDelete: (instance: Instance) => void;
    build: (data: CreateData, params?: {
        status?: 'new' | 'existing';
    }) => Instance;
    createOne: (data: CreateData, configuration?: CreateDataParamsI) => Promise<Instance>;
    createMany: (data: CreateData[], configuration?: CreateDataParamsI) => Promise<Instance[]>;
    getRelationshipConfiguration: <Alias extends keyof RelatedNodesToAssociateI>(alias: Alias) => Required<RelationshipsI<RelatedNodesToAssociateI>[Alias]>;
    getRelationshipByAlias: <Alias extends keyof RelatedNodesToAssociateI>(alias: Alias) => Pick<RelatedNodesToAssociateI[Alias], 'name' | 'direction' | 'model'>;
    reverseRelationshipConfiguration: <Alias extends keyof RelatedNodesToAssociateI>(alias: Alias) => RelationshipsI<RelatedNodesToAssociateI>[Alias];
    update: (data: Partial<Properties>, params?: GenericConfiguration & {
        where?: WhereParamsI;
        /** defaults to false. Whether to return the properties of the nodes after the update. If it's false, the first entry of the return value of this function will be an empty array */
        return?: boolean;
    }) => Promise<[Instance[], QueryResult]>;
    updateRelationship: (data: AnyObject, params: {
        alias: keyof RelatedNodesToAssociateI;
        where?: {
            source?: WhereParamsI;
            target?: WhereParamsI;
            relationship?: WhereParamsI;
        };
        session?: GenericConfiguration['session'];
    }) => Promise<QueryResult>;
    /** returns the relationship properties to be created, from the data in dataToUse (with the alias as a key) */
    getRelationshipProperties: (relationship: RelationshipsI<any>[0], dataToUse: Neo4jSupportedProperties) => Neo4jSupportedProperties;
    delete: (configuration?: GenericConfiguration & {
        detach?: boolean;
        where: WhereParamsI;
    }) => Promise<number>;
    findMany: (params?: GenericConfiguration & {
        /** where params for the nodes of this Model */
        where?: WhereParamsI;
        limit?: number;
        skip?: number;
        order?: Array<[Extract<keyof Properties, string>, 'ASC' | 'DESC']>;
    }) => Promise<Instance[]>;
    findOne: (params?: GenericConfiguration & {
        /** where params for the nodes of this Model */
        where?: WhereParamsI;
        order?: Array<[Extract<keyof Properties, string>, 'ASC' | 'DESC']>;
    }) => Promise<Instance | null>;
    relateTo: <Alias extends keyof RelatedNodesToAssociateI>(params: {
        alias: Alias;
        where: {
            source: WhereParamsI;
            target: WhereParamsI;
        };
        properties?: RelatedNodesToAssociateI[Alias]['CreateRelationshipProperties'];
        /** throws an error if the number of created relationships don't equal to this number */
        assertCreatedRelationships?: number;
        session?: GenericConfiguration['session'];
    }) => Promise<number>;
    createRelationship: (params: CreateRelationshipParamsI & {
        /** throws an error if the number of created relationships don't equal to this number */
        assertCreatedRelationships?: number;
    }) => Promise<number>;
    getLabelFromRelationshipModel: (relationshipModel: NeogmaModel<any, any, Object, Object> | 'self') => string;
    getRelationshipModel: (relationshipModel: NeogmaModel<any, any, Object, Object> | 'self') => NeogmaModel<any, any, Object, Object>;
    /** asserts that the given primaryKeyField exists. Also returns it for typescript purposes */
    assertPrimaryKeyField: (primaryKeyField: string | undefined, operation: string) => string;
}
/** the methods of a Neogma Instance */
interface NeogmaInstanceMethodsI<Properties extends Neo4jSupportedProperties, RelatedNodesToAssociateI extends AnyObject, MethodsI extends AnyObject, Instance = NeogmaInstance<Properties, RelatedNodesToAssociateI, MethodsI>> {
    __existsInDatabase: boolean;
    dataValues: Properties;
    changed: Record<keyof Properties, boolean>;
    getDataValues: () => Properties;
    save: (configuration?: CreateDataParamsI) => Promise<Instance>;
    validate: () => Promise<void>;
    updateRelationship: (data: AnyObject, params: {
        alias: keyof RelatedNodesToAssociateI;
        where?: {
            target?: WhereParamsI;
            relationship?: WhereParamsI;
        };
        session?: GenericConfiguration['session'];
    }) => Promise<QueryResult>;
    delete: (configuration?: GenericConfiguration & {
        detach?: boolean;
    }) => Promise<number>;
    relateTo: <Alias extends keyof RelatedNodesToAssociateI>(params: {
        alias: Alias;
        where: WhereParamsI;
        properties?: RelatedNodesToAssociateI[Alias]['CreateRelationshipProperties'];
        /** throws an error if the number of created relationships don't equal to this number */
        assertCreatedRelationships?: number;
        session?: GenericConfiguration['session'];
    }) => Promise<number>;
}
/** the type of instance of the Model */
export declare type NeogmaInstance<
/** the properties used in the Model */
Properties extends Neo4jSupportedProperties, RelatedNodesToAssociateI extends AnyObject, 
/** the Methods used in the Model */
MethodsI extends AnyObject = AnyObject> = Properties & NeogmaInstanceMethodsI<Properties, RelatedNodesToAssociateI, MethodsI> & MethodsI;
/** the type of a Neogma Model */
export declare type NeogmaModel<Properties extends Neo4jSupportedProperties, RelatedNodesToAssociateI extends AnyObject, MethodsI extends AnyObject = Object, StaticsI extends AnyObject = Object> = NeogmaModelStaticsI<Properties, RelatedNodesToAssociateI, MethodsI> & StaticsI;
export declare type FindManyIncludeI<AliasKeys> = {
    alias: AliasKeys;
    /** where params for the nodes of the included Model */
    where?: WhereParamsI;
    /** default false */
    optional?: boolean;
    include?: FindManyIncludeI<any>;
};
/**
 * a function which returns a class with the model operation functions for the given Properties
 * RelatedNodesToAssociateI are the corresponding Nodes for Relationships
 */
export declare const ModelFactory: <Properties extends Record<string, string | number | boolean | import("neo4j-driver/types/integer").default | import("neo4j-driver/types/spatial-types").Point<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").Date<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").Time<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").LocalTime<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").DateTime<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").LocalDateTime<import("neo4j-driver/types/integer").default> | import("neo4j-driver/types/temporal-types").Duration<import("neo4j-driver/types/integer").default> | import("../Queries").Neo4jSingleTypes[] | undefined>, RelatedNodesToAssociateI extends Record<string, any>, StaticsI extends Record<string, any> = Object, MethodsI extends Record<string, any> = Object>(parameters: {
    /** the schema for the validation */
    schema: { [index in keyof Properties]: Revalidator.ISchema<Properties> | Revalidator.JSONSchema<Properties>; };
    /** the label of the nodes */
    label: string | string[];
    /** statics of the Model */
    statics?: Partial<StaticsI> | undefined;
    /** method of the Instance */
    methods?: Partial<MethodsI> | undefined;
    /** the id key of this model. Is required in order to perform specific instance methods */
    primaryKeyField?: Extract<keyof Properties, string> | undefined;
    /** relationships with other models or itself. Alternatively, relationships can be added using Model.addRelationships */
    relationships?: Partial<RelationshipsI<RelatedNodesToAssociateI>> | undefined;
}, neogma: Neogma) => NeogmaModel<Properties, RelatedNodesToAssociateI, MethodsI, StaticsI>;
export {};
