export const isRawParameter = (param) => {
    return !!param.raw;
};
export const isMatchParameter = (param) => {
    return !!param.match;
};
export const isMatchRelated = (param) => {
    return !!param.related;
};
export const isMatchMultiple = (param) => {
    return !!param.multiple;
};
export const isMatchLiteral = (param) => {
    return !!param.literal;
};
export const isCreateParameter = (param) => {
    return !!param.create;
};
export const isCreateRelated = (param) => {
    return !!param.related;
};
export const isCreateMultiple = (param) => {
    return !!param.multiple;
};
export const isMergeParameter = (param) => {
    return !!param.merge;
};
export const isDeleteParameter = (param) => {
    return !!param.delete;
};
export const isDeleteWithIdentifier = (_param) => {
    const param = _param;
    return !!param.identifiers;
};
export const isDeleteWithLiteral = (_param) => {
    const param = _param;
    return !!param.literal;
};
export const isSetParameter = (param) => {
    return !!param.set;
};
export const isRemoveParameter = (param) => {
    return !!param.remove;
};
export const isRemoveProperties = (_param) => {
    const param = _param;
    return !!(param.properties && param.identifier);
};
export const isRemoveLabels = (_param) => {
    const param = _param;
    return !!(param.labels && param.identifier);
};
export const isReturnParameter = (param) => {
    return !!param.return;
};
export const isReturnObject = (param) => {
    return (Array.isArray(param) &&
        param.findIndex((v) => typeof v !== 'object' || !v.identifier) < 0);
};
export const isLimitParameter = (limit) => {
    return !!limit.limit;
};
export const isSkipParameter = (skip) => {
    return !!skip.skip;
};
export const isWithParameter = (wth) => {
    return !!wth.with;
};
export const isOrderByParameter = (orderBy) => {
    return !!orderBy.orderBy;
};
export const isUnwindParameter = (unwind) => {
    return !!unwind.unwind;
};
export const isWhereParameter = (where) => {
    return !!where.where;
};
export const isForEachParameter = (forEach) => {
    return !!forEach.forEach;
};
export const isNodeWithWhere = (node) => {
    return !!node.where;
};
export const isNodeWithLabel = (node) => {
    return !!node.label;
};
export const isNodeWithModel = (node) => {
    return !!node.model;
};
export const isNodeWithProperties = (node) => {
    return !!node.properties;
};
export const isRelationshipWithWhere = (relationship) => {
    return !!relationship.where;
};
export const isRelationshipWithProperties = (relationship) => {
    return !!relationship.properties;
};
export const isRelationship = (_relationship) => {
    const relationship = _relationship;
    return typeof relationship === 'string' || !!relationship.direction;
};
//# sourceMappingURL=QueryBuilder.types.js.map