import {
    isObject,
    constructJsonbPath,
    bothArray,
    neitherArray,
    nestedFields,
    rightHandArray,
    leftHandArray,
} from './helpers.js';

const METHODS = {
    $ne: 'whereNot',
    $in: 'whereIn',
    $nin: 'whereNotIn',
    $or: 'orWhere',
    $and: 'andWhere'
};

const OPERATORS = {
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
    $like: 'like',
    $notlike: 'not like',
    $ilike: 'ilike'
};


export function buildJsonbQuery(knexQuery, query = {}, parentKey, path = [], nested = false, jsonbColumns) {
    
    return Object.keys(query || {}).reduce((currentQuery, key) => {
        let value = query[key];

        if (isObject(value) && !(value instanceof Date) && !['$len', '$contains', '*'].includes(key)) {
            return this.buildJsonbQuery(currentQuery, value, key, [...path, key], nested, jsonbColumns)
        }

        if (jsonbColumns.includes(path[0]) || nested) {
            let operator = key.startsWith('$') || key === '*' ? key : '=';

            if (operator === '=') {
                path.push(key);
            }

            const { firstElement, middlePath, lastElement } = constructJsonbPath(path, operator);
            let pathStart = `${firstElement}${!!middlePath ? `->${middlePath}` : ''}`;
            let pathEnd = (lastElement !== undefined && lastElement !== null) ? lastElement : `'${key}'`;

            // Handle different array cases
            if (Array.isArray(value) && ['$like[]', '$notlike[]', '$notilike[]', '$ilike[]', '$in', '$nin'].includes(operator)) {
                                          
                rightHandArray.call(this, currentQuery, pathStart, pathEnd, operator, key, value, lastElement, buildJsonbQuery, jsonbColumns);
                return currentQuery;
            }

            if (!Array.isArray(value) && ['$contains', '$len'].includes(operator)) {
                leftHandArray.call(this, currentQuery, pathStart, pathEnd, operator, key, value, lastElement, buildJsonbQuery, jsonbColumns);
                return currentQuery;
            }

            if (!Array.isArray(value) && ['=', '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$like', '$notlike', '$ilike', '$notilike'].includes(operator)) {
                neitherArray.call(this, currentQuery, pathStart, pathEnd, operator, key, value, lastElement, buildJsonbQuery, jsonbColumns);
                return currentQuery;
            }

            if (Array.isArray(value) && ['$any', '$all'].includes(operator)) {
                bothArray.call(this, currentQuery, pathStart, pathEnd, operator, key, value, lastElement, buildJsonbQuery, jsonbColumns);
                return currentQuery;
            }

            if (operator === '*') {
                if (!isObject(value)) {
                    throw new Error(`Nested * queries must continue a path. Try $any or $all for scalar filters`);
                }
                nestedFields.call(this, currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns);
                return currentQuery;
            }
        }

        const column = parentKey || key;
        const method = METHODS[key];
        const operator = OPERATORS[key] || '=';

        if (method) {
            if (key === '$or' || key === '$and') {
                currentQuery.where(function () {
                    for (const condition of value) {
                        this[method](function () {
                            this.buildJsonbQuery(this, condition, null, path, nested, jsonbColumns);
                        });
                    }
                });
                return currentQuery;
            }
            return currentQuery[method](column, value);
        }

        return operator === '='
            ? currentQuery.where(column, value)
            : currentQuery.where(column, operator, value);

    }, knexQuery);
}
