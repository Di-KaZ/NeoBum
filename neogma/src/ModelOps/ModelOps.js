/* eslint-disable @typescript-eslint/ban-types */
import clone from 'clone';
import revalidator from 'revalidator';
import { NeogmaConstraintError } from '../Errors/NeogmaConstraintError';
import { NeogmaError } from '../Errors/NeogmaError';
import { NeogmaInstanceValidationError } from '../Errors/NeogmaInstanceValidationError';
import { NeogmaNotFoundError } from '../Errors/NeogmaNotFoundError';
import { QueryBuilder, } from '../Queries';
import { BindParam } from '../Queries/BindParam/BindParam';
import { QueryRunner, } from '../Queries/QueryRunner';
import { Where, } from '../Queries/Where';
/**
 * a function which returns a class with the model operation functions for the given Properties
 * RelatedNodesToAssociateI are the corresponding Nodes for Relationships
 */
export const ModelFactory = (parameters, neogma) => {
    var _a;
    const { label: modelLabel, primaryKeyField: modelPrimaryKeyField, schema, } = parameters;
    const statics = parameters.statics || {};
    const methods = parameters.methods || {};
    /* helper name for queries */
    const modelName = (modelLabel instanceof Array
        ? modelLabel
        : [modelLabel]).join('');
    const schemaKeys = new Set(Object.keys(schema));
    const queryRunner = neogma.queryRunner;
    const _relationships = clone(parameters.relationships) || {};
    const Model = (_a = class ModelClass {
            /** adds more relationship configurations to the Model (instead of using the "relationships" param on the ModelFactory constructor) */
            static addRelationships(relationships) {
                for (const key in relationships) {
                    Model.relationships[key] = relationships[key];
                }
            }
            /**
             * @returns {String} - the normalized label of this Model
             */
            static getLabel(operation) {
                return QueryBuilder.getNormalizedLabels(modelLabel, operation);
            }
            /**
             * @returns {String} - the label or labels of this Model as given in its definition
             */
            static getRawLabels() {
                return modelLabel;
            }
            /**
             *
             * @returns {String} - the primary key field of this Model
             */
            static getPrimaryKeyField() {
                return modelPrimaryKeyField || null;
            }
            static getModelName() {
                return modelName;
            }
            getDataValues() {
                const properties = Object.keys(schema).reduce((acc, key) => {
                    if (this[key] !== undefined) {
                        acc[key] = this[key];
                    }
                    return acc;
                }, {});
                return properties;
            }
            /**
             * validates the given instance
             * @throws NeogmaInstanceValidationError
             */
            async validate() {
                const validationResult = revalidator.validate(this.getDataValues(), {
                    type: 'object',
                    properties: schema,
                });
                if (validationResult.errors.length) {
                    throw new NeogmaInstanceValidationError('Error while validating an instance', {
                        model: Model,
                        errors: validationResult.errors,
                    });
                }
            }
            /**
             * builds data Instance by data, setting information fields appropriately
             * status 'new' can be called publicly (hence the .build wrapper), but 'existing' should be used only internally when building instances after finding nodes from the database
             */
            static build(data, params) {
                const instance = new Model();
                const status = params?.status || 'new';
                instance.__existsInDatabase = status === 'existing';
                instance.dataValues = {};
                instance.changed = {};
                for (const _key of [
                    ...Object.keys(schema),
                    ...Object.keys(Model.relationships),
                ]) {
                    const key = _key;
                    /* set dataValues using data */
                    if (data.hasOwnProperty(key)) {
                        instance.dataValues[key] = data[key];
                        instance.changed[key] = status === 'new';
                    }
                    /* set the setters and getters of the keys */
                    Object.defineProperty(instance, key, {
                        get: () => {
                            return instance.dataValues[key];
                        },
                        set: (val) => {
                            instance.dataValues[key] = val;
                            instance.changed[key] = true;
                        },
                    });
                }
                return instance;
            }
            /**
             * saves an instance to the database. If it's new it creates it, and if it already exists it edits it
             */
            async save(_configuration) {
                const instance = this;
                const configuration = {
                    validate: true,
                    ..._configuration,
                };
                if (instance.__existsInDatabase) {
                    if (configuration.validate) {
                        await instance.validate();
                    }
                    const primaryKeyField = Model.assertPrimaryKeyField(modelPrimaryKeyField, 'updating via save');
                    // if it exists in the database, update the node by only the fields which have changed
                    const updateData = Object.entries(instance.changed).reduce((val, [key, changed]) => {
                        if (changed && schemaKeys.has(key)) {
                            val[key] = instance[key];
                        }
                        return val;
                    }, {});
                    const numberOfPropertiesToSet = Object.keys(updateData).length;
                    if (numberOfPropertiesToSet) {
                        const updateRes = await Model.update(updateData, {
                            return: false,
                            session: configuration?.session,
                            where: {
                                [primaryKeyField]: instance[primaryKeyField],
                            },
                        });
                        const propertiesSet = updateRes[1].summary.counters.updates()
                            .propertiesSet;
                        if (propertiesSet !== numberOfPropertiesToSet) {
                            throw new NeogmaError('Update via save failed, not all properties were updated', {
                                instance: this,
                                updateRes,
                            });
                        }
                    }
                    // set all changed to false
                    for (const key in this.changed) {
                        if (!this.changed.hasOwnProperty(key)) {
                            continue;
                        }
                        this.changed[key] = false;
                    }
                    return instance;
                }
                else {
                    // if it's a new one - it doesn't exist in the database yet, need to create it
                    // do not validate here, as createOne validates the instance
                    return Model.createOne(instance.getDataValues(), configuration);
                }
            }
            /**
             * creates the node, also creating its children nodes and relationships
             * @param {Properties} data - the data to create, potentially including data for related nodes to be created
             * @param {GenericConfiguration} configuration - query configuration
             * @returns {Properties} - the created data
             */
            static async createOne(data, configuration) {
                const instances = await Model.createMany([data], configuration);
                return instances[0];
            }
            static async createMany(data, configuration) {
                configuration = configuration || {};
                const validate = !(configuration.validate === false);
                // used only for unique names
                const identifiers = new BindParam();
                /** identifiers and the where/relationship configuration for a relationship to be created */
                const toRelateByIdentifier = {};
                const rootInstances = [];
                const bulkCreateData = [];
                /** parameters for the QueryBuilder */
                const queryBuilderParams = [];
                /** Bind Param which will be used in the QueryBuilder, and in creating parameters for literals */
                const bindParam = new BindParam();
                /** count the number of relationships created by properties, since it's deterministic, so we can calculate the number of relationships created by where for the assertRelationshipsOfWhere param */
                let relationshipsCreatedByProperties = 0;
                const addCreateToStatement = async (_model, dataToUse, 
                /** whether to merge instead of creating the properties */
                mergeProperties, parentNode) => {
                    // cast to no statics/method for type safety
                    const model = _model;
                    for (const createData of dataToUse) {
                        /** identifier for the node to create */
                        const identifier = identifiers.getUniqueNameAndAdd('node', null);
                        const label = model.getLabel();
                        const instance = (createData instanceof
                            model
                            ? createData
                            : model.build(createData, {
                                status: 'new',
                            }));
                        await model.beforeCreate?.(instance);
                        if (validate) {
                            await instance.validate();
                        }
                        instance.__existsInDatabase = true;
                        // set all changed to false as it's going to be saved
                        for (const key in instance.changed) {
                            if (!instance.changed.hasOwnProperty(key)) {
                                continue;
                            }
                            instance.changed[key] = false;
                        }
                        // push to instances only if it's the root node
                        if (!parentNode) {
                            rootInstances.push(instance);
                        }
                        const relatedNodesToAssociate = {};
                        for (const alias of Object.keys(model.relationships)) {
                            if (instance[alias]) {
                                relatedNodesToAssociate[alias] = instance[alias];
                            }
                        }
                        if (relatedNodesToAssociate ||
                            parentNode ||
                            mergeProperties) {
                            /* if it has related nodes to associated or it has a parent node or it's to be merged, create it as a single node, with an identifier */
                            const createOrMergeProperties = {
                                identifier,
                                label,
                                properties: instance.getDataValues(),
                            };
                            if (mergeProperties) {
                                queryBuilderParams.push({
                                    merge: createOrMergeProperties,
                                });
                            }
                            else {
                                queryBuilderParams.push({
                                    create: createOrMergeProperties,
                                });
                            }
                            /** if it has a parent node, also create a relationship with it */
                            if (parentNode) {
                                const { relationship, identifier: parentIdentifier, } = parentNode;
                                const relatedQueryBuilderParameters = {
                                    related: [
                                        {
                                            identifier: parentIdentifier,
                                        },
                                        {
                                            direction: relationship.direction,
                                            name: relationship.name,
                                            properties: model.getRelationshipProperties(relationship, createData) || null,
                                        },
                                        {
                                            identifier,
                                        },
                                    ],
                                };
                                if (mergeProperties) {
                                    queryBuilderParams.push({
                                        merge: relatedQueryBuilderParameters,
                                    });
                                }
                                else {
                                    queryBuilderParams.push({
                                        create: relatedQueryBuilderParameters,
                                    });
                                }
                            }
                            /** create the related nodes */
                            for (const relationshipAlias in relatedNodesToAssociate) {
                                const relatedNodesData = relatedNodesToAssociate[relationshipAlias];
                                if (!relatedNodesData) {
                                    continue;
                                }
                                const relationship = model.getRelationshipConfiguration(relationshipAlias);
                                const otherModel = model.getRelationshipModel(relationship.model);
                                if (relatedNodesData.properties) {
                                    await addCreateToStatement(otherModel, relatedNodesData.properties, relatedNodesData.propertiesMergeConfig
                                        ?.nodes, {
                                        identifier,
                                        relationship,
                                        mergeRelationship: relatedNodesData
                                            .propertiesMergeConfig
                                            ?.relationship,
                                    });
                                    // increment the relationships-created-by-properties by the length of the data array
                                    relationshipsCreatedByProperties +=
                                        relatedNodesData.properties.length;
                                }
                                if (relatedNodesData.where) {
                                    const whereArr = relatedNodesData.where instanceof Array
                                        ? relatedNodesData.where
                                        : [relatedNodesData.where];
                                    for (const whereEntry of whereArr) {
                                        if (!toRelateByIdentifier[identifier]) {
                                            toRelateByIdentifier[identifier] = [];
                                        }
                                        const relationshipProperties = model.getRelationshipProperties(relationship, whereEntry.relationshipProperties || {});
                                        toRelateByIdentifier[identifier].push({
                                            relationship,
                                            where: whereEntry.params,
                                            properties: relationshipProperties,
                                            merge: whereEntry.merge,
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            /* if it doesn't have related nodes to associated and it doesn't have a parent node add it to the array so they'll be bulk created */
                            bulkCreateData.push(instance.getDataValues());
                        }
                    }
                };
                await addCreateToStatement(Model, data, configuration?.merge, undefined);
                // parse data to bulk create
                if (bulkCreateData.length) {
                    const bulkCreateIdentifier = identifiers.getUniqueNameAndAdd('bulkCreateNodes', null);
                    const bulkCreateOptionsParam = bindParam.getUniqueNameAndAdd('bulkCreateOptions', bulkCreateData);
                    const bulkCreateDataIdentifier = identifiers.getUniqueNameAndAdd('bulkCreateData', null);
                    /** bulk create via unwind at the beginning of the query */
                    queryBuilderParams.unshift({
                        unwind: {
                            value: `$${bulkCreateOptionsParam}`,
                            as: bulkCreateDataIdentifier,
                        },
                    }, {
                        create: {
                            identifier: bulkCreateIdentifier,
                            label: this.getLabel(),
                        },
                    }, {
                        set: `${bulkCreateIdentifier} += ${bulkCreateDataIdentifier}`,
                    });
                }
                // parse toRelateByIdentifier
                for (const identifier of Object.keys(toRelateByIdentifier)) {
                    /** to be used in the WITH clause */
                    const allNeededIdentifiers = Object.keys(toRelateByIdentifier);
                    for (const relateParameters of toRelateByIdentifier[identifier]) {
                        const relationship = relateParameters.relationship;
                        const relationshipIdentifier = identifiers.getUniqueNameAndAdd('r', null);
                        const targetNodeModel = Model.getRelationshipModel(relationship.model);
                        const targetNodeLabel = targetNodeModel.getLabel();
                        const targetNodeIdentifier = identifiers.getUniqueNameAndAdd('targetNode', null);
                        const relatedQueryBuilderParameters = {
                            related: [
                                {
                                    identifier,
                                },
                                {
                                    direction: relationship.direction,
                                    name: relationship.name,
                                    identifier: relationshipIdentifier,
                                },
                                {
                                    identifier: targetNodeIdentifier,
                                },
                            ],
                        };
                        queryBuilderParams.push({
                            with: `DISTINCT ${allNeededIdentifiers.join(', ')}`,
                        }, {
                            match: {
                                identifier: targetNodeIdentifier,
                                label: targetNodeLabel,
                            },
                        }, {
                            where: {
                                [targetNodeIdentifier]: relateParameters.where,
                            },
                        }, relateParameters.merge
                            ? {
                                merge: relatedQueryBuilderParameters,
                            }
                            : {
                                create: relatedQueryBuilderParameters,
                            });
                        if (relateParameters.properties &&
                            Object.keys(relateParameters.properties).length > 0) {
                            /* create the relationship properties */
                            const relationshipPropertiesParam = bindParam.getUniqueNameAndAdd('relationshipProperty', relateParameters.properties);
                            queryBuilderParams.push({
                                set: `${relationshipIdentifier} += $${relationshipPropertiesParam}`,
                            });
                        }
                        // remove this relateParameters from the array
                        toRelateByIdentifier[identifier] = toRelateByIdentifier[identifier].filter((r) => r !== relateParameters);
                    }
                    // remove the identifier from the object
                    delete toRelateByIdentifier[identifier];
                }
                // create a QueryBuilder instance, add the params and run it
                const res = await new QueryBuilder(bindParam)
                    .addParams(queryBuilderParams)
                    .run(queryRunner, configuration?.session);
                const { assertRelationshipsOfWhere } = configuration;
                if (assertRelationshipsOfWhere) {
                    const relationshipsCreated = res.summary.counters.updates()
                        .relationshipsCreated;
                    // the total created relationship must equal the ones created by properties (calculated) plus the ones created by where (param)
                    if (relationshipsCreated !==
                        relationshipsCreatedByProperties +
                            assertRelationshipsOfWhere) {
                        throw new NeogmaError(`Not all required relationships by where param were created`, {
                            relationshipsCreated,
                            relationshipCreatedByProperties: relationshipsCreatedByProperties,
                            assertRelationshipsOfWhere,
                        });
                    }
                }
                return rootInstances;
            }
            static async update(data, params) {
                const label = Model.getLabel();
                const identifier = 'node';
                const where = params?.where
                    ? {
                        [identifier]: params.where,
                    }
                    : undefined;
                const res = await queryRunner.update({
                    label,
                    data,
                    where,
                    identifier,
                    return: params?.return,
                    session: params?.session,
                });
                const nodeProperties = params?.return
                    ? QueryRunner.getResultProperties(res, identifier)
                    : [];
                const instances = nodeProperties.map((v) => Model.build(v, { status: 'existing' }));
                return [instances, res];
            }
            static async updateRelationship(data, params) {
                const relationship = Model.getRelationshipConfiguration(params.alias);
                const identifiers = {
                    source: 'source',
                    target: 'target',
                    relationship: 'r',
                };
                const labels = {
                    source: Model.getLabel(),
                    target: Model.getRelationshipModel(relationship.model).getLabel(),
                };
                const where = new Where({});
                if (params.where?.source) {
                    where.addParams({ [identifiers.source]: params.where.source });
                }
                if (params.where?.target) {
                    where.addParams({ [identifiers.target]: params.where.target });
                }
                if (params.where?.relationship) {
                    where.addParams({
                        [identifiers.relationship]: params.where.relationship,
                    });
                }
                const queryBuilder = new QueryBuilder(
                /* clone the where bind param and construct one for the update, as there might be common keys between where and data */
                where.getBindParam().clone());
                queryBuilder.match({
                    related: [
                        {
                            identifier: identifiers.source,
                            label: labels.source,
                        },
                        {
                            direction: relationship.direction,
                            name: relationship.name,
                            identifier: identifiers.relationship,
                        },
                        {
                            identifier: identifiers.target,
                            label: labels.target,
                        },
                    ],
                });
                if (where) {
                    queryBuilder.where(where);
                }
                queryBuilder.set({
                    properties: data,
                    identifier: identifiers.relationship,
                });
                return queryBuilder.run(queryRunner, params.session);
            }
            async updateRelationship(data, params) {
                const primaryKeyField = Model.assertPrimaryKeyField(modelPrimaryKeyField, 'updateRelationship');
                return Model.updateRelationship(data, {
                    ...params,
                    where: {
                        ...params.where,
                        source: {
                            [primaryKeyField]: this[primaryKeyField],
                        },
                    },
                });
            }
            static async delete(configuration) {
                const detach = configuration?.detach;
                const whereParams = configuration?.where;
                const label = Model.getLabel();
                const identifier = 'node';
                const res = await queryRunner.delete({
                    label,
                    where: whereParams && {
                        [identifier]: whereParams,
                    },
                    detach,
                    identifier,
                    session: configuration?.session,
                });
                return QueryRunner.getNodesDeleted(res);
            }
            async delete(configuration) {
                const primaryKeyField = Model.assertPrimaryKeyField(modelPrimaryKeyField, 'delete');
                await Model.beforeDelete?.(this);
                return Model.delete({
                    ...configuration,
                    where: {
                        [primaryKeyField]: this[primaryKeyField],
                    },
                });
            }
            static async findMany(params) {
                const label = this.getLabel();
                const rootIdentifier = modelName;
                const bindParam = new BindParam();
                const rootWhere = params?.where &&
                    new Where({
                        [rootIdentifier]: params?.where,
                    }, bindParam);
                const queryBuilder = new QueryBuilder(bindParam);
                queryBuilder.match({
                    identifier: rootIdentifier,
                    label,
                });
                if (rootWhere) {
                    queryBuilder.where(rootWhere);
                }
                queryBuilder.return(rootIdentifier);
                if (params?.order) {
                    queryBuilder.orderBy(params.order
                        .filter(([field]) => schemaKeys.has(field))
                        .map(([property, direction]) => ({
                        identifier: rootIdentifier,
                        direction,
                        property,
                    })));
                }
                if (params?.skip) {
                    queryBuilder.skip(+params.skip);
                }
                if (params?.limit) {
                    queryBuilder.limit(+params.limit);
                }
                const res = await queryBuilder.run(queryRunner, params?.session);
                const instances = res.records.map((record) => {
                    const node = record.get(rootIdentifier);
                    const properties = node.properties;
                    const instance = Model.build(properties, {
                        status: 'existing',
                    });
                    instance.__existsInDatabase = true;
                    return instance;
                });
                return instances;
            }
            static async findOne(params) {
                const instances = await Model.findMany({
                    ...params,
                    limit: 1,
                });
                return instances?.[0] || null;
            }
            /** creates a relationship by using the configuration specified in "relationships" from the given alias */
            static async relateTo(params) {
                const relationship = Model.getRelationshipConfiguration(params.alias);
                const where = {};
                if (params.where) {
                    where[QueryRunner.identifiers.createRelationship.source] =
                        params.where.source;
                    where[QueryRunner.identifiers.createRelationship.target] =
                        params.where.target;
                }
                const relationshipProperties = Model.getRelationshipProperties(relationship, params.properties || {});
                const res = await queryRunner.createRelationship({
                    source: {
                        label: this.getLabel(),
                    },
                    target: {
                        label: Model.getRelationshipModel(relationship.model).getLabel(),
                    },
                    relationship: {
                        name: relationship.name,
                        direction: relationship.direction,
                        properties: relationshipProperties,
                    },
                    where,
                    session: params.session,
                });
                const relationshipsCreated = res.summary.counters.updates()
                    .relationshipsCreated;
                const { assertCreatedRelationships } = params;
                if (assertCreatedRelationships &&
                    relationshipsCreated !== assertCreatedRelationships) {
                    throw new NeogmaError(`Not all required relationships were created`, {
                        relationshipsCreated,
                        ...params,
                    });
                }
                return relationshipsCreated;
            }
            /** wrapper for the static relateTo, where the source is always this node */
            async relateTo(params) {
                const primaryKeyField = Model.assertPrimaryKeyField(modelPrimaryKeyField, 'relateTo');
                return Model.relateTo({
                    ...params,
                    where: {
                        source: {
                            [primaryKeyField]: this[primaryKeyField],
                        },
                        target: params.where,
                    },
                });
            }
            /**
             * @param {queryRunner.CreateRelationshipParamsI} - the parameters including the 2 nodes and the label/direction of the relationship between them
             * @param {GenericConfiguration} configuration - query configuration
             * @returns {Number} - the number of created relationships
             */
            static async createRelationship(params) {
                const res = await queryRunner.createRelationship(params);
                const relationshipsCreated = res.summary.counters.updates()
                    .relationshipsCreated;
                const { assertCreatedRelationships } = params;
                if (assertCreatedRelationships &&
                    relationshipsCreated !== assertCreatedRelationships) {
                    throw new NeogmaError(`Not all required relationships were created`, {
                        relationshipsCreated,
                        ...params,
                    });
                }
                return relationshipsCreated;
            }
            /** gets the label from the given model for a relationship */
            static getLabelFromRelationshipModel(relationshipModel) {
                return relationshipModel === 'self'
                    ? Model.getLabel()
                    : relationshipModel.getLabel();
            }
            /** gets the model of a relationship */
            static getRelationshipModel(relationshipModel) {
                return relationshipModel === 'self'
                    ? Model
                    : relationshipModel;
            }
            static assertPrimaryKeyField(primaryKeyField, operation) {
                if (!primaryKeyField) {
                    throw new NeogmaConstraintError(`This operation (${operation}) required the model to have a primaryKeyField`);
                }
                return primaryKeyField;
            }
        },
        _a.relationships = _relationships,
        _a.getRelationshipConfiguration = (alias) => {
            if (!Model.relationships) {
                throw new NeogmaNotFoundError(`Relationship definitions can't be found for the model ${modelName}`);
            }
            const relationship = Model.relationships[alias];
            if (!relationship) {
                throw new NeogmaNotFoundError(`The relationship of the alias ${alias} can't be found for the model ${modelName}`);
            }
            const returnValue = {
                model: relationship.model,
                direction: relationship.direction,
                name: relationship.name,
                properties: relationship.properties,
            };
            return returnValue;
        },
        _a.getRelationshipByAlias = (alias) => {
            const relationshipConfiguration = Model.getRelationshipConfiguration(alias);
            return {
                model: relationshipConfiguration.model,
                direction: relationshipConfiguration.direction,
                name: relationshipConfiguration.name,
            };
        },
        /**
         * reverses the configuration of a relationship, so it can be easily duplicated when defining another Model.
         */
        _a.reverseRelationshipConfiguration = (alias) => {
            const relationship = Model.getRelationshipConfiguration(alias);
            const reverseDirection = (d) => {
                if (d === 'in') {
                    return 'out';
                }
                if (d === 'out') {
                    return 'in';
                }
                return 'none';
            };
            return {
                model: Model,
                direction: reverseDirection(relationship.direction),
                name: relationship.name,
                properties: relationship.properties,
            };
        },
        _a.getRelationshipProperties = (relationship, dataToUse) => {
            const keysToUse = Object.keys(relationship.properties || {});
            /** properties to be used in the relationship */
            const relationshipProperties = {};
            /** total validation for the properties */
            const validationSchema = {};
            for (const key of keysToUse) {
                const property = relationship.properties?.[key]
                    ?.property;
                if (!property) {
                    continue;
                }
                relationshipProperties[property] = dataToUse[key];
                const schema = relationship.properties?.[key]?.schema;
                if (!schema) {
                    continue;
                }
                validationSchema[property] = schema;
            }
            const validationResult = revalidator.validate(relationshipProperties, {
                type: 'object',
                properties: validationSchema,
            });
            if (validationResult.errors.length) {
                throw new NeogmaInstanceValidationError(`Could not validate relationship property`, {
                    model: Model,
                    errors: validationResult.errors,
                });
            }
            return relationshipProperties;
        },
        _a);
    for (const staticKey in statics) {
        if (!statics.hasOwnProperty(staticKey)) {
            continue;
        }
        Model[staticKey] = statics[staticKey];
    }
    for (const methodKey in methods) {
        if (!methods.hasOwnProperty(methodKey)) {
            continue;
        }
        Model.prototype[methodKey] =
            methods[methodKey];
    }
    // add to modelsByName
    neogma.modelsByName[modelName] = Model;
    return Model;
};
//# sourceMappingURL=ModelOps.js.map