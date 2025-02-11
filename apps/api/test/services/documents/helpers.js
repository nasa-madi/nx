import assert from 'node:assert/strict';
import { describe, before, after, it, test } from 'node:test';
// import sinon from 'sinon';
import { KnexService } from '@feathersjs/knex';
import knex from 'knex';
// import { app } from '../../../src/app.js';




function isObject(item) {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}


function pick(obj, ...paths) {
    return paths.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}


const METHODS = {
    $ne: 'whereNot',
    $in: 'whereIn',
    $nin: 'whereNotIn',
    $or: 'orWhere',
    $and: 'andWhere'
}

const OPERATORS = {
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
    $like: 'like',
    $notlike: 'not like',
    $ilike: 'ilike'
}

const RETURNING_CLIENTS = ['postgresql', 'pg', 'oracledb', 'mssql', 'sqlite3']

function buildContainsQuery(builder, fullPath, targetValue, negate) {
    let column = fullPath[0];
    let path = fullPath.slice(1);
    let jsonPath = path.map(key => (typeof key === 'number' ? key.toString() : key === '*' ? '?' : key));
    const operator = negate ? 'NOT @>' : '@>';
    
    // Handle wildcard (`*`) in paths
    let query = '';
    if (jsonPath.includes('?')) {
        const index = jsonPath.indexOf('?');
        const staticPath = jsonPath.slice(0, index).join(',');
        const dynamicPath = jsonPath.slice(index + 1).join(',');
        query = `
            EXISTS (
                SELECT 1 
                FROM jsonb_array_elements(${column}#>'{${staticPath}}') AS elem
                WHERE elem#>'{${dynamicPath}}' ${operator} ?
            )
        `;
        return builder.whereRaw(query, [JSON.stringify(targetValue)]);
    } else {
        query = `${column}#>'{${jsonPath.join(',')}}' ${operator} ?`;
        return builder.whereRaw(query, [JSON.stringify(targetValue)]);
    }
}



function buildInQuery(builder, fullPath, values) {
    let column = fullPath[0];
    let backPath = fullPath.slice(1);
    return builder
        .whereRaw(
        `${column}#>>'{${backPath}}' IN (${values.map(() => '?').join(', ')})`,
        values
      )
      .toString();
}

function buildExactMatchQuery(builder, fullPath, targetValue) {
    let column = fullPath[0];
    let backPath = fullPath.slice(1)
    return builder
      .whereRaw(
        `${column}#>>? = ?`,
        [backPath.map(key => (typeof key === 'number' ? key.toString() : key)), targetValue]
      )
      .toString();
}

function buildLikeQuery(builder, fullPath, pattern) {
    let column = fullPath[0];
    let backPath = fullPath.slice(1)
    return builder
      .whereRaw(
        `${column}#>>? LIKE ?`,
        [backPath.map(key => (typeof key === 'number' ? key.toString() : key)), pattern]
      )
      .toString();
}

function buildILikeArrayQuery(builder, fullPath, pattern) {
    let column = fullPath[0];
    let backPath = fullPath.slice(1)
    const jsonPathString = backPath.map(key => (typeof key === 'number' ? key.toString() : key)).join(',');
    return builder
      .whereRaw(
        `EXISTS (SELECT 1 FROM jsonb_array_elements_text${column}#>'{${jsonPathString}}') AS elem WHERE elem ILIKE ?)`,
        [pattern]
      )
      .toString();
}
  
function buildILikeQuery(builder, fullPath, pattern) {
    let column = fullPath[0];
    let backPath = fullPath.slice(1).map(key => (typeof key === 'number' ? key.toString() : key)).join(',');

    return builder
        .whereRaw(
        `${column}#>>'{${backPath}}' IN (${values.map(() => '?').join(', ')})`,
        values
      )
      .toString();
}

export function extractQueryComponents(query) {
    const result = {
        value: null,
        operator: null,
        path: []
    };

    function traverse(obj, currentPath = []) {
        if (Array.isArray(obj)) {
            // Handle arrays by iterating over each element
            obj.forEach((item, index) => {
                if (typeof item === 'object' && !Array.isArray(item)) {
                    traverse(item, [...currentPath, index]);
                } else {
                    result.operator = '*';
                    result.value = item;
                    result.path = [...currentPath, index];
                }
            });
        } else {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        traverse(value, [...currentPath, key]);
                    } else {
                        result.operator = key;
                        result.value = value;
                        result.path = currentPath;
                    }
                }
            }
        }
    }

    traverse(query);
    return result;
}



// Define the TestService class
class TestService extends KnexService {
    constructor(options) {
        super(options);
        this.options = options;
        this.jsonColumns = ['metadata']
    }

    isJsonBColumn(column){
        return this.jsonColumns.includes(column)
    }

    knexify(knexQuery, query = {}, parentKey, path=[]) {
        const knexify = this.knexify.bind(this);



        return Object.keys(query || {}).reduce((currentQuery, key) => {
            const value = query[key];


            if(this.isJsonBColumn(key)){
                let { value, operator, path: path2 } = extractQueryComponents(query);
                console.log(value, operator, path2) 
                switch (operator) {
                    case '*':
                        return buildContainsQuery(currentQuery, path2, value);
                    case '=':
                    case '$eq':
                        return buildExactMatchQuery(currentQuery, path2, value);
                    case '!=':
                    case '$ne':
                        return buildExactMatchQuery(currentQuery, path2, value, true);
                    case '$like':
                        return buildLikeQuery(currentQuery, path2, value);
                    case '$notlike':
                        return buildLikeQuery(currentQuery, path2, value, true);
                    case '$ilike':
                        return buildILikeQuery(currentQuery, path2, value);
                    case '$ilike[]':
                        return buildILikeArrayQuery(currentQuery, path2, value);
                    case '$in':
                        return buildInQuery(currentQuery, path2, value);
                    case '$nin':
                        return buildInQuery(currentQuery, path2, value, true);
                    case '$gt':
                    case '$gte':
                    case '$lt':
                    case '$lte':
                    default:
                        return currentQuery
                }
            }
            if (isObject(value) && !(value instanceof Date)) {
                return knexify(currentQuery, value, key);
            }
            
            const column = parentKey || key;
            const method = METHODS[key];
            const operator = OPERATORS[key] || '=';

            if (method) {
                if (key === '$or' || key === '$and') {
                    currentQuery.where(function () {
                        for (const condition of value) {
                            this[method](function () {
                                knexify(this, condition, null);
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

    createQuery(params = {}) {
        const { name, id } = this.getOptions(params);
        const { filters, query } = this.filterQuery(params);
        const builder = this.db(params);
        if (filters.$select) {
            const select = filters.$select.map((column) => (column.includes('.') ? column : `${name}.${column}`));
            builder.select(...new Set([...select, `${name}.${id}`]));
        } else {
            builder.select(`${name}.*`);
        }
        this.knexify(builder, {
            ...query,
            ...pick(filters, '$and', '$or')
        });
        if (filters.$sort) {
            return Object.keys(filters.$sort).reduce((currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'), builder);
        }
        return builder;
    }
}

// Initialize the service
let client = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'unicorn_user',
        password: 'magical_password',
        database: 'rainbow_database',
        port: 5432
    }
});

export const service = new TestService({
    name: 'documents',
    Model: client,
    id: 'id'
});