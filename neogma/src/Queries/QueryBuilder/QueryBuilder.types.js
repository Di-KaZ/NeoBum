"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelationship = exports.isRelationshipWithProperties = exports.isRelationshipWithWhere = exports.isNodeWithProperties = exports.isNodeWithModel = exports.isNodeWithLabel = exports.isNodeWithWhere = exports.isForEachParameter = exports.isWhereParameter = exports.isUnwindParameter = exports.isOrderByParameter = exports.isWithParameter = exports.isSkipParameter = exports.isLimitParameter = exports.isReturnObject = exports.isReturnParameter = exports.isRemoveLabels = exports.isRemoveProperties = exports.isRemoveParameter = exports.isSetParameter = exports.isDeleteWithLiteral = exports.isDeleteWithIdentifier = exports.isDeleteParameter = exports.isMergeParameter = exports.isCreateMultiple = exports.isCreateRelated = exports.isCreateParameter = exports.isMatchLiteral = exports.isMatchMultiple = exports.isMatchRelated = exports.isMatchParameter = exports.isRawParameter = void 0;
const isRawParameter = (param) => {
    return !!param.raw;
};
exports.isRawParameter = isRawParameter;
const isMatchParameter = (param) => {
    return !!param.match;
};
exports.isMatchParameter = isMatchParameter;
const isMatchRelated = (param) => {
    return !!param.related;
};
exports.isMatchRelated = isMatchRelated;
const isMatchMultiple = (param) => {
    return !!param.multiple;
};
exports.isMatchMultiple = isMatchMultiple;
const isMatchLiteral = (param) => {
    return !!param.literal;
};
exports.isMatchLiteral = isMatchLiteral;
const isCreateParameter = (param) => {
    return !!param.create;
};
exports.isCreateParameter = isCreateParameter;
const isCreateRelated = (param) => {
    return !!param.related;
};
exports.isCreateRelated = isCreateRelated;
const isCreateMultiple = (param) => {
    return !!param.multiple;
};
exports.isCreateMultiple = isCreateMultiple;
const isMergeParameter = (param) => {
    return !!param.merge;
};
exports.isMergeParameter = isMergeParameter;
const isDeleteParameter = (param) => {
    return !!param.delete;
};
exports.isDeleteParameter = isDeleteParameter;
const isDeleteWithIdentifier = (_param) => {
    const param = _param;
    return !!param.identifiers;
};
exports.isDeleteWithIdentifier = isDeleteWithIdentifier;
const isDeleteWithLiteral = (_param) => {
    const param = _param;
    return !!param.literal;
};
exports.isDeleteWithLiteral = isDeleteWithLiteral;
const isSetParameter = (param) => {
    return !!param.set;
};
exports.isSetParameter = isSetParameter;
const isRemoveParameter = (param) => {
    return !!param.remove;
};
exports.isRemoveParameter = isRemoveParameter;
const isRemoveProperties = (_param) => {
    const param = _param;
    return !!(param.properties && param.identifier);
};
exports.isRemoveProperties = isRemoveProperties;
const isRemoveLabels = (_param) => {
    const param = _param;
    return !!(param.labels && param.identifier);
};
exports.isRemoveLabels = isRemoveLabels;
const isReturnParameter = (param) => {
    return !!param.return;
};
exports.isReturnParameter = isReturnParameter;
const isReturnObject = (param) => {
    return (Array.isArray(param) &&
        param.findIndex((v) => typeof v !== 'object' || !v.identifier) < 0);
};
exports.isReturnObject = isReturnObject;
const isLimitParameter = (limit) => {
    return !!limit.limit;
};
exports.isLimitParameter = isLimitParameter;
const isSkipParameter = (skip) => {
    return !!skip.skip;
};
exports.isSkipParameter = isSkipParameter;
const isWithParameter = (wth) => {
    return !!wth.with;
};
exports.isWithParameter = isWithParameter;
const isOrderByParameter = (orderBy) => {
    return !!orderBy.orderBy;
};
exports.isOrderByParameter = isOrderByParameter;
const isUnwindParameter = (unwind) => {
    return !!unwind.unwind;
};
exports.isUnwindParameter = isUnwindParameter;
const isWhereParameter = (where) => {
    return !!where.where;
};
exports.isWhereParameter = isWhereParameter;
const isForEachParameter = (forEach) => {
    return !!forEach.forEach;
};
exports.isForEachParameter = isForEachParameter;
const isNodeWithWhere = (node) => {
    return !!node.where;
};
exports.isNodeWithWhere = isNodeWithWhere;
const isNodeWithLabel = (node) => {
    return !!node.label;
};
exports.isNodeWithLabel = isNodeWithLabel;
const isNodeWithModel = (node) => {
    return !!node.model;
};
exports.isNodeWithModel = isNodeWithModel;
const isNodeWithProperties = (node) => {
    return !!node.properties;
};
exports.isNodeWithProperties = isNodeWithProperties;
const isRelationshipWithWhere = (relationship) => {
    return !!relationship.where;
};
exports.isRelationshipWithWhere = isRelationshipWithWhere;
const isRelationshipWithProperties = (relationship) => {
    return !!relationship.properties;
};
exports.isRelationshipWithProperties = isRelationshipWithProperties;
const isRelationship = (_relationship) => {
    const relationship = _relationship;
    return typeof relationship === 'string' || !!relationship.direction;
};
exports.isRelationship = isRelationship;
//# sourceMappingURL=QueryBuilder.types.js.map