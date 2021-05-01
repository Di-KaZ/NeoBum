"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const Sessions_1 = require("../../Sessions");
const Errors_1 = require("../../Errors");
const neo4j_driver_1 = require("neo4j-driver");
const string_1 = require("../../utils/string");
const BindParam_1 = require("../BindParam");
const Where_1 = require("../Where");
const QueryRunner_1 = require("../QueryRunner");
const QueryBuilder_types_1 = require("./QueryBuilder.types");
class QueryBuilder {
    constructor(
    /** an existing bindParam to be used */
    bindParam) {
        /** parameters for the query to be generated */
        this.parameters = [];
        /** the statement for the query */
        this.statement = '';
        this.bindParam = BindParam_1.BindParam.acquire(bindParam);
    }
    addParams(
    /** parameters for the query */
    parameters, ...restParameters) {
        const allParameters = Array.isArray(parameters)
            ? parameters
            : [parameters];
        if (restParameters) {
            allParameters.push(...restParameters);
        }
        this.parameters.push(...allParameters);
        this.setStatementByParameters(allParameters);
        return this;
    }
    /** get the generated statement for the query */
    getStatement() {
        return this.statement;
    }
    /** get the bind parameter for the query */
    getBindParam() {
        return this.bindParam;
    }
    /** generates the statement by using the parameters and the bindParam */
    setStatementByParameters(parameters) {
        const statementParts = [];
        for (const param of parameters) {
            if (param === null || param === undefined) {
                continue;
            }
            if (QueryBuilder_types_1.isRawParameter(param)) {
                statementParts.push(param.raw);
            }
            else if (QueryBuilder_types_1.isMatchParameter(param)) {
                statementParts.push(this.getMatchString(param.match));
            }
            else if (QueryBuilder_types_1.isCreateParameter(param)) {
                statementParts.push(this.getCreateOrMergeString(param.create, 'create'));
            }
            else if (QueryBuilder_types_1.isMergeParameter(param)) {
                statementParts.push(this.getCreateOrMergeString(param.merge, 'merge'));
            }
            else if (QueryBuilder_types_1.isSetParameter(param)) {
                statementParts.push(this.getSetString(param.set));
            }
            else if (QueryBuilder_types_1.isDeleteParameter(param)) {
                statementParts.push(this.getDeleteString(param.delete));
            }
            else if (QueryBuilder_types_1.isRemoveParameter(param)) {
                statementParts.push(this.getRemoveString(param.remove));
            }
            else if (QueryBuilder_types_1.isReturnParameter(param)) {
                statementParts.push(this.getReturnString(param.return));
            }
            else if (QueryBuilder_types_1.isLimitParameter(param)) {
                statementParts.push(this.getLimitString(param.limit));
            }
            else if (QueryBuilder_types_1.isWithParameter(param)) {
                statementParts.push(this.getWithString(param.with));
            }
            else if (QueryBuilder_types_1.isSkipParameter(param)) {
                statementParts.push(this.getSkipString(param.skip));
            }
            else if (QueryBuilder_types_1.isUnwindParameter(param)) {
                statementParts.push(this.getUnwindString(param.unwind));
            }
            else if (QueryBuilder_types_1.isForEachParameter(param)) {
                statementParts.push(this.getForEachString(param.forEach));
            }
            else if (QueryBuilder_types_1.isOrderByParameter(param)) {
                statementParts.push(this.getOrderByString(param.orderBy));
            }
            else if (QueryBuilder_types_1.isWhereParameter(param)) {
                statementParts.push(this.getWhereString(param.where));
            }
        }
        // join the statement parts and trim all whitespace. Append them to the existing statement
        this.statement = string_1.trimWhitespace(this.statement + ' ' + statementParts.join('\n'));
    }
    getNodeString(node) {
        if (typeof node === 'string') {
            return node;
        }
        // else, it's a NodeObjectI
        let label = '';
        if (QueryBuilder_types_1.isNodeWithLabel(node)) {
            label = node.label;
        }
        else if (QueryBuilder_types_1.isNodeWithModel(node)) {
            label = node.model.getLabel();
        }
        const getNodeStatementParams = {
            identifier: node.identifier,
            label,
        };
        if (QueryBuilder_types_1.isNodeWithWhere(node)) {
            getNodeStatementParams.inner = new Where_1.Where({
                [node.identifier || '']: node.where,
            }, this.bindParam);
        }
        else if (QueryBuilder_types_1.isNodeWithProperties(node)) {
            getNodeStatementParams.inner = {
                properties: node.properties,
                bindParam: this.getBindParam(),
            };
        }
        // (identifier: label { where })
        return QueryBuilder.getNodeStatement(getNodeStatementParams);
    }
    getRelationshipString(relationship) {
        if (typeof relationship === 'string') {
            return relationship;
        }
        // else, it's a relationship object
        const { direction, identifier, name } = relationship;
        const getRelationshipStatementParams = {
            direction,
            identifier: relationship.identifier,
            name,
        };
        if (QueryBuilder_types_1.isRelationshipWithWhere(relationship)) {
            getRelationshipStatementParams.inner = new Where_1.Where({
                [identifier || '']: relationship.where,
            }, this.bindParam);
        }
        else if (QueryBuilder_types_1.isRelationshipWithProperties(relationship)) {
            getRelationshipStatementParams.inner = {
                properties: relationship.properties,
                bindParam: this.getBindParam(),
            };
        }
        return QueryBuilder.getRelationshipStatement(getRelationshipStatementParams);
    }
    /** returns a string in the format `MATCH (a:Node) WHERE a.p1 = $v1` */
    getMatchString(match) {
        if (typeof match === 'string') {
            return `MATCH ${match}`;
        }
        if (QueryBuilder_types_1.isMatchMultiple(match)) {
            return [
                match.optional ? 'OPTIONAL' : '',
                'MATCH',
                match.multiple
                    .map((element) => this.getNodeString(element))
                    .join(', '),
            ].join(' ');
        }
        if (QueryBuilder_types_1.isMatchRelated(match)) {
            // every even element is a node, every odd element is a relationship
            const parts = [];
            for (let index = 0; index < match.related.length; index++) {
                const element = match.related[index];
                if (index % 2) {
                    // even, parse as relationship
                    if (!QueryBuilder_types_1.isRelationship(element)) {
                        throw new Errors_1.NeogmaConstraintError('even argument of related is not a relationship');
                    }
                    parts.push(this.getRelationshipString(element));
                }
                else {
                    // odd, parse as node
                    parts.push(this.getNodeString(element));
                }
            }
            return [
                match.optional ? 'OPTIONAL' : '',
                'MATCH',
                parts.join(''),
            ].join(' ');
        }
        if (QueryBuilder_types_1.isMatchLiteral(match)) {
            return [
                match.optional ? 'OPTIONAL' : '',
                `MATCH ${this.getNodeString(match.literal)}`,
            ].join(' ');
        }
        // else, is a node
        return [
            match.optional ? 'OPTIONAL' : '',
            `MATCH ${this.getNodeString(match)}`,
        ].join(' ');
    }
    getCreateOrMergeString(create, mode) {
        const createOrMerge = mode === 'merge' ? 'MERGE' : 'CREATE';
        if (typeof create === 'string') {
            return `${createOrMerge} ${create}`;
        }
        if (QueryBuilder_types_1.isCreateMultiple(create)) {
            return [
                createOrMerge,
                create.multiple
                    .map((element) => this.getNodeString(element))
                    .join(', '),
            ].join(' ');
        }
        if (QueryBuilder_types_1.isCreateRelated(create)) {
            // every even element is a node, every odd element is a relationship
            const parts = [];
            for (let index = 0; index < create.related.length; index++) {
                const element = create.related[index];
                if (index % 2) {
                    // even, parse as relationship
                    if (!QueryBuilder_types_1.isRelationship(element)) {
                        throw new Errors_1.NeogmaConstraintError('even argument of related is not a relationship');
                    }
                    parts.push(this.getRelationshipString(element));
                }
                else {
                    // odd, parse as node
                    parts.push(this.getNodeString(element));
                }
            }
            return [createOrMerge, parts.join('')].join(' ');
        }
        // else, is a node
        if (QueryBuilder_types_1.isNodeWithLabel(create)) {
            return [
                createOrMerge,
                this.getNodeString({
                    identifier: create.identifier,
                    label: create.label,
                    properties: create.properties,
                }),
            ].join(' ');
        }
        if (QueryBuilder_types_1.isNodeWithModel(create)) {
            return [
                createOrMerge,
                this.getNodeString({
                    identifier: create.identifier,
                    model: create.model,
                    properties: create.properties,
                }),
            ].join(' ');
        }
        throw new Errors_1.NeogmaConstraintError('Invanid create parameter', {
            actual: create,
        });
    }
    /** returns a string in the format: `SET a.p1 = $v1, a.p2 = $v2` */
    getSetString(set) {
        if (typeof set === 'string') {
            return `SET ${set}`;
        }
        return QueryBuilder.getSetParts({
            data: set.properties,
            identifier: set.identifier,
            bindParam: this.bindParam,
        }).statement;
    }
    getDeleteString(dlt) {
        if (typeof dlt === 'string') {
            return `DELETE ${dlt}`;
        }
        if (QueryBuilder_types_1.isDeleteWithIdentifier(dlt)) {
            const identifiers = Array.isArray(dlt.identifiers)
                ? dlt.identifiers
                : [dlt.identifiers];
            return `${dlt.detach ? 'DETACH ' : ''}DELETE ${identifiers.join(', ')}`;
        }
        if (QueryBuilder_types_1.isDeleteWithLiteral(dlt)) {
            return `${dlt.detach ? 'DETACH ' : ''}DELETE ${dlt.literal}`;
        }
        throw new Errors_1.NeogmaConstraintError('invalid delete configuration');
    }
    getRemoveString(remove) {
        if (typeof remove === 'string') {
            return `REMOVE ${remove}`;
        }
        if (QueryBuilder_types_1.isRemoveProperties(remove)) {
            const properties = Array.isArray(remove.properties)
                ? remove.properties
                : [remove.properties];
            const propertiesWithIdentifier = properties.map((p) => `${remove.identifier}.${p}`);
            return `REMOVE ${propertiesWithIdentifier.join(', ')}`;
        }
        if (QueryBuilder_types_1.isRemoveLabels(remove)) {
            const labels = Array.isArray(remove.labels)
                ? remove.labels
                : [remove.labels];
            return `REMOVE ${remove.identifier}:${labels.join(':')}`;
        }
        throw new Errors_1.NeogmaConstraintError('invalid remove configuration');
    }
    getReturnString(rtn) {
        if (typeof rtn === 'string') {
            return `RETURN ${rtn}`;
        }
        if (QueryBuilder_types_1.isReturnObject(rtn)) {
            const returnString = rtn
                .map((v) => `${v.identifier}${v.property ? '.' + v.property : ''}`)
                .join(', ');
            return `RETURN ${returnString}`;
        }
        // else string array
        return `RETURN ${rtn.join(', ')}`;
    }
    getLimitString(limit) {
        const limitString = typeof limit === 'string'
            ? limit
            : `$${this.bindParam.getUniqueNameAndAdd('limit', neo4j_driver_1.int(limit))}`;
        return `LIMIT ${limitString}`;
    }
    getSkipString(skip) {
        const skipString = typeof skip === 'string'
            ? skip
            : `$${this.bindParam.getUniqueNameAndAdd('skip', neo4j_driver_1.int(skip))}`;
        return `SKIP ${skipString}`;
    }
    getWithString(wth) {
        const wthArr = Array.isArray(wth) ? wth : [wth];
        return `WITH ${wthArr.join(', ')}`;
    }
    getUnwindString(unwind) {
        const unwindString = typeof unwind === 'string'
            ? unwind
            : `${unwind.value} AS ${unwind.as}`;
        return `UNWIND ${unwindString}`;
    }
    getForEachString(forEach) {
        return `FOR EACH ${forEach}`;
    }
    getOrderByString(orderBy) {
        if (typeof orderBy === 'string') {
            return `ORDER BY ${orderBy}`;
        }
        if (Array.isArray(orderBy)) {
            const orderByParts = orderBy.map((element) => {
                if (typeof element === 'string') {
                    return element;
                }
                if (Array.isArray(element)) {
                    return `${element[0]} ${element[1]}`;
                }
                return [
                    // identifier.property
                    [element.identifier, element.property]
                        .filter((v) => v)
                        .join('.'),
                    // ASC or DESC
                    element.direction,
                ]
                    .filter((v) => v)
                    .join(' ');
            });
            return `ORDER BY ${orderByParts.join(', ')}`;
        }
        // else, it's the object type
        const orderByString = [
            // identifier.property
            [orderBy.identifier, orderBy.property].filter((v) => v).join('.'),
            // ASC or DESC
            orderBy.direction,
        ]
            .filter((v) => v)
            .join(' ');
        return `ORDER BY ${orderByString}`;
    }
    getWhereString(where) {
        if (typeof where === 'string') {
            return `WHERE ${where}`;
        }
        if (where instanceof Where_1.Where) {
            const statement = where.getStatement('text');
            if (!statement) {
                return '';
            }
            return `WHERE ${statement}`;
        }
        // else, where object
        const whereInstance = new Where_1.Where(where, this.bindParam);
        const statement = whereInstance.getStatement('text');
        if (!statement) {
            return '';
        }
        return `WHERE ${statement}`;
    }
    /** runs this instance with the given QueryRunner instance */
    async run(
    /** the QueryRunner instance to use */
    queryRunnerOrRunnable, 
    /** an existing session to use. Set it only if the first param is a QueryRunner instance */
    existingSession) {
        const queryRunner = queryRunnerOrRunnable instanceof QueryRunner_1.QueryRunner
            ? queryRunnerOrRunnable
            : QueryBuilder.queryRunner;
        if (!queryRunner) {
            throw new Errors_1.NeogmaError('A queryRunner was not given to run this builder. Make sure that the first parameter is a QueryRunner instance, or that QueryBuilder.queryRunner is set');
        }
        const sessionToGet = queryRunnerOrRunnable &&
            !(queryRunnerOrRunnable instanceof QueryRunner_1.QueryRunner)
            ? queryRunnerOrRunnable
            : existingSession;
        return Sessions_1.getRunnable(sessionToGet, async (session) => {
            return queryRunner.run(this.getStatement(), this.getBindParam().get(), session);
        }, queryRunner.getDriver());
    }
    /** a literal statement to use as is */
    raw(raw) {
        return this.addParams({ raw });
    }
    /** MATCH statement */
    match(match) {
        return this.addParams({ match });
    }
    /** CREATE statement */
    create(create) {
        return this.addParams({ create });
    }
    /** MERGE statement */
    merge(merge) {
        return this.addParams({ merge });
    }
    /** SET statement */
    set(set) {
        return this.addParams({ set });
    }
    /** DELETE statement */
    delete(deleteParam) {
        return this.addParams({ delete: deleteParam });
    }
    /** REMOVE statement */
    remove(remove) {
        return this.addParams({ remove });
    }
    /** RETURN statement */
    return(returnParam) {
        return this.addParams({ return: returnParam });
    }
    /** LIMIT statement */
    limit(limit) {
        return this.addParams({ limit });
    }
    /** WITH statement */
    with(withParam) {
        return this.addParams({ with: withParam });
    }
    /** ORDER BY statement */
    orderBy(orderBy) {
        return this.addParams({ orderBy });
    }
    /** UNWIND statement */
    unwind(unwind) {
        return this.addParams({ unwind });
    }
    /** FOR EACH statement */
    forEach(forEach) {
        return this.addParams({ forEach });
    }
    /** SKIP statement */
    skip(skip) {
        return this.addParams({ skip });
    }
    /** WHERE statement */
    where(where) {
        return this.addParams({ where });
    }
}
exports.QueryBuilder = QueryBuilder;
/**
 * surrounds the label with backticks to also allow spaces
 * @param label - the label to use
 * @param operation - defaults to 'and'. Whether to generate a "and" or an "or" operation for the labels
 */
QueryBuilder.getNormalizedLabels = (label, operation) => {
    const labels = label instanceof Array ? label : [label];
    return labels
        .map((l) => '`' + l + '`')
        .join(operation === 'or' ? '|' : ':');
};
/**
 * returns a string to be used in a query, regardless if any of the identifier or label are null
 */
QueryBuilder.getIdentifierWithLabel = (identifier, label) => {
    return `${identifier ? identifier : ''}${label ? ':' + label : ''}`;
};
/**
 * returns the appropriate string for a node, ready to be put in a statement
 * example: (ident: Label { a.p1: $v1 })
 */
QueryBuilder.getNodeStatement = ({ identifier, label, inner, }) => {
    const nodeParts = [];
    if (identifier || label) {
        nodeParts.push(QueryBuilder.getIdentifierWithLabel(identifier, label));
    }
    if (inner) {
        if (typeof inner === 'string') {
            nodeParts.push(inner);
        }
        else if (inner instanceof Where_1.Where) {
            nodeParts.push(inner.getStatement('object'));
        }
        else {
            nodeParts.push(QueryBuilder.getPropertiesWithParams(inner.properties, inner.bindParam));
        }
    }
    return `(${nodeParts.join(' ')})`;
};
/**
 * returns the appropriate string for a relationship, ready to be put in a statement
 * example: -[identifier: name {where}]->
 */
QueryBuilder.getRelationshipStatement = (params) => {
    const { direction, name, inner } = params;
    const identifier = params.identifier || '';
    const allParts = [];
    // <- or -
    allParts.push(direction === 'in' ? '<-' : '-');
    // strings will be inside [ ]
    const innerRelationshipParts = [];
    // identifier:Name
    if (identifier || name) {
        innerRelationshipParts.push(QueryBuilder.getIdentifierWithLabel(identifier, name));
    }
    if (inner) {
        if (typeof inner === 'string') {
            innerRelationshipParts.push(inner);
        }
        else if (inner instanceof Where_1.Where) {
            innerRelationshipParts.push(inner.getStatement('object'));
        }
        else {
            innerRelationshipParts.push(QueryBuilder.getPropertiesWithParams(inner.properties, inner.bindParam));
        }
    }
    // wrap it in [ ]
    allParts.push(`[${innerRelationshipParts.join(' ')}]`);
    // -> or -
    allParts.push(direction === 'out' ? '->' : '-');
    return allParts.join('');
};
/** returns the parts and the statement for a SET operation with the given params */
QueryBuilder.getSetParts = (params) => {
    const { data, bindParam, identifier } = params;
    const setParts = [];
    for (const key in data) {
        if (!data.hasOwnProperty(key)) {
            continue;
        }
        const paramKey = bindParam.getUniqueNameAndAdd(key, data[key]);
        setParts.push(`${identifier}.${key} = $${paramKey}`);
    }
    if (!setParts.length) {
        return {
            parts: [],
            statement: '',
        };
    }
    return {
        parts: setParts,
        statement: `SET ${setParts.join(', ')}`,
    };
};
/**
 * returns an object with replacing its values with a bind param value
 * example return value: ( a.p1 = $v1, b.p2 = $v2 )
 */
QueryBuilder.getPropertiesWithParams = (
/** data to set */
data, 
/** bind param to use and mutate */
bindParam) => {
    const parts = [];
    for (const key of Object.keys(data)) {
        parts.push(`${key}: $${bindParam.getUniqueNameAndAdd(key, data[key])}`);
    }
    return `{ ${parts.join(', ')} }`;
};
//# sourceMappingURL=QueryBuilder.js.map