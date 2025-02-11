import qs from 'qs';    
import assert from 'node:assert/strict';
import { describe, before, after, it, test } from 'node:test';
// import sinon from 'sinon';
import { KnexService } from '@feathersjs/knex';
import knex from 'knex';

import { qoList, aList, object1, object2 } from './examples.js';
import { isNumber } from 'knex/lib/util/is.js';

const stringQuery = `
user.name=John
&user.details.age[$lte]=30
&user.details.address=123 Street
&user.details.hobbies[$in][0]=reading
&user.details.hobbies[$in][1]=swimming
&user.details.list[*]=item2
&user.details.list2[*].a=b
&user.details.list3[*].n[*]=1
&user.details.list4[0].a=b
&user.details.list5[0][a]=b
&user.details.list6[$eq][a]=b
&user.details.list6[$eq][c]=d
&status=active
&tags[0]=sports
&tags[1]=health
&items[$nin][0]=item1
&items[$nin][1]=item3
&$or[0][archived][$ne]=true
&$or[1][roomId]=2
&$and[0][archived][$ne]=true
&$and[1][roomId]=2
`

function isObject(item) {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

function isJsonBColumn(column){
    return ['metadata'].includes(column)
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


/*
any document where user.details.hobbies is either reading or swimming
    &user.details.hobbies[$in][0]=reading
    &user.details.hobbies[$in][1]=swimming

    WHERE user->'details'->'hobbies' ?| array['reading', 'swimming']


any document that with user.details.list with 1+ item equal to item2
    &user.details.list[*]=item2

    WHERE 'item2' = ANY (user->'details'->'list'::jsonb_array_elements_text())

any document that with user.details.list2 with 1+ item where a=b
    &user.details.list2[*].a=b

    WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list2') elem
       WHERE elem->>'a' = 'b'
   )

any document that with user.details.list3 with 1+ item where n contains 1
    &user.details.list3[*].n[*]=1

    WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list3') elem
       WHERE 1 = ANY (jsonb_array_elements_text(elem->'n')::int[])
   )

any document that with user.details.list4 where the second item has a=b
    &user.details.list4[1].a=b
    &user.details.list4[1][a]=b

    WHERE user->'details'->'list4'->1->>'a' = 'b'

any document that with user.details.list6 where the array is exactly equivalent to [{a:b, c:d}]
    &user.details.list6[$eq].a=b
    &user.details.list6[$eq][c]=d

    WHERE user->'details'->'list6' = '[{"a": "b", "c": "d"}]'::jsonb

any document that with user.details.list7 where list7 is ann array with length greater than or equal to 2
    $user.details.list7[$len][$gte]=2

    WHERE jsonb_array_length(user->'details'->'list7') >= 2


any document that with user.details.list8 with at least one item where n is an array that contains at least one item where a=b
    &user.details.list8[*].n[*].a=b

   WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list8') elem
       WHERE EXISTS (
           SELECT 1 FROM jsonb_array_elements(elem->'n') n_elem
           WHERE n_elem->>'a' = 'b'
       )
   )

*/


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
let builder = client('documents')

await client('documents')
  .insert({ id: 1, metadata: object1 })
  .onConflict('id')
  .merge()
  .then(data => console.log(data))
  .catch(err => console.log(err));

await client('documents')
  .insert({ id: 2, metadata: object2 })
  .onConflict('id')
  .merge()
  .then(data => console.log(data))
  .catch(err => console.log(err));







function constructJsonbPath(path, operator, isTextComparison = false) {
    const firstElement = path[0];
    let lastElement = path.length > 1 ? path[path.length - 1] : null;
    lastElement = isNaN(lastElement) ? `'${lastElement}'` : lastElement
    const middlePath = path.length > 2 
    ? path.slice(1, -1).map(part => isNaN(part) ? `'${part}'` : part).join('->') 
    : null;
    return {firstElement, middlePath, lastElement};
}

function knexify(knexQuery, query = {}, parentKey, path=[], nested=false) {

    return Object.keys(query || {}).reduce((currentQuery, key) => {
        let value = query[key];
        const isKeyNumeric = !isNaN(parseInt(key)) && isFinite(key);

        if (isObject(value) && !(value instanceof Date) && !['$len','$contains','*'].includes(key)) {
            return knexify(currentQuery, value, key, [...path,key], nested);
        }

        if(isJsonBColumn(path[0]) || nested){
            let operator = key.startsWith('$') || key === '*' ? key : '='

            if(operator === '=') {
                path.push(key)
            }
            
            const { firstElement:fe, middlePath:mp, lastElement:le } = constructJsonbPath(path, operator)
            let pathStart = `${fe}${!!mp?`->${mp}`:''}`;
            let pathEnd = (le !== undefined && le !== null) ? le : `'${key}'`
                            
            // //checks it value is valid ISO date
            // const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/;
            // const isDate = isoDateRegex.test(value) && !isNaN(Date.parse(value));

            // const isDate = !isNaN(Date.parse(value));
            const isValueNumeric = !isNaN(parseFloat(value)) && isFinite(value);
            
            // pathEnd = isValueNumeric ? parseFloat(value) : `'${pathEnd}'`;  // if the value is a number, we assume it is identifying an array index

            // RIGHT HAND ARRAY
            if(Array.isArray(value) && ['$like[]', '$notlike[]', '$notilike[]', '$ilike[]', '$in', '$nin'].includes(operator)){
                rightHandArray(currentQuery, pathStart, pathEnd, operator, key, value, isValueNumeric)
                return currentQuery
            }

            // LEFT HAND ARRAY
            if(!Array.isArray(value) && ['$contains','$len'].includes(operator)){
                leftHandArray(currentQuery, pathStart, pathEnd, operator, key, value, isValueNumeric)
                return currentQuery
            }

            // NEITHER ARRAY
            if(!Array.isArray(value) && ['=', '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$like', '$notlike', '$ilike' ,'$notilike'].includes(operator)){
                neitherArray(currentQuery, pathStart, pathEnd, operator, key, value, isValueNumeric)
                return currentQuery
            }

            // BOTH ARRAY
            if(Array.isArray(value) && ['$any', '$all'].includes(operator)){
                bothArray(currentQuery, pathStart, pathEnd, operator, key, value, isValueNumeric)
                return currentQuery
            }

            // NESTED FIELDS
            if(operator === '*'){
                if(!isObject(value)){
                    throw new Error(`Nested * queries must continue a path.  Try $any or $all for scalar filters`)
                }
                nestedFields(currentQuery, pathStart, pathEnd, operator, key, value, le)
                return currentQuery
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
                            knexify(this, condition, null);
                        });
                    }
                });
                // console.log(key, column, value)
                return currentQuery;
            }
            // console.log(key, column, value)
            return currentQuery[method](column, value);
        }
        // console.log(operator, column, value)
        return operator === '='
            ? currentQuery.where(column, value)
            : currentQuery.where(column, operator, value);


            // let comparator
            // switch (operator) {

            //     // ARRAY NESTING QUERIES
            //     case '*':
            //         // always build a subquery
            //         // console.log('in a *');
            //         currentQuery.whereExists(function () {
            //             const randomString = "a" + Math.random().toString(36).substring(2, 7);

            //             // if the value is an array, we need a different type of subselect 
            //             if (typeof value === 'string' || isValueNumeric){
            //                 this.select(1)
            //                     .from(client.raw(`jsonb_array_elements_text(${pathStart}->${le}) AS ${randomString}`))                                
            //                 this.whereRaw(`${randomString} = ?`, [value])
            //             }else{
            //                 this.select(1)
            //                     .from(client.raw(`jsonb_array_elements(${pathStart}->${le}) AS ${randomString}`))
            //                     .where(function () { 
            //                         let nextKey = Object.keys(value)[0]
            //                         if(nextKey.startsWith('$')){
            //                             return knexify(this, value, randomString, [randomString], false);
            //                         }
            //                         return knexify(this, value, randomString, [randomString], true);
            //                     })
            //             }
            //         });

            //         return currentQuery                    

                
                

            //     // // NEITHER ARRAY
            //     // case '=':
            //     // case '$eq':
            //     //     if(Array.isArray(value)){
            //     //         currentQuery.whereRaw(`${pathStart}->${pathEnd} @> ?::jsonb`, [JSON.stringify(value)]);
            //     //     }else{
            //     //         currentQuery.whereRaw(`${pathStart}->>${pathEnd} = ?`, [value]);
            //     //     }
            //     //     break;
            //     // case '!=':
            //     // case '$ne':
            //     //     currentQuery.whereRaw(`${pathStart}->>${pathEnd} != ?`, [value]);
            //     //     break;
            //     // case '$like':
            //     //     currentQuery.whereRaw(`${pathStart}->>${pathEnd} LIKE ?`, [value]);          
            //     //     break;          
            //     // case '$notlike':
            //     //     currentQuery.whereRaw(`${pathStart}->>${pathEnd} NOT LIKE ?`, [value]);    
            //     //     break;
            //     // case '$ilike':
            //     //     currentQuery.whereRaw(`${pathStart}->>${pathEnd} ILIKE ?`, [value]);
            //     //     break;

                
            //     // // LEFT HAND ARRAY
            //     // case '$contains': 
            //     // case '$len':
            //     //     currentQuery.whereRaw(`jsonb_array_length(${pathStart}->${pathEnd}) = ?`, [value]);
            //     //     break;
            


            //     // // BOTH ARRAY
            //     // case '$any':
            //     //     // any overlap between and left hand array and right hand array returns true.
            //     // case '$all':
            //     //     // right hand array is a subset of left hand array.
                


            //     // // NUMERIC COMPARATORS
            //     // case '$gt':
            //     // case '$gte':
            //     // case '$lt':
            //     // case '$lte':
            //     //     comparator = ['>', '>=', '<', '<='][['$gt', '$gte', '$lt', '$lte'].indexOf(key)]
            //     //     if(isDate){
            //     //         const unixTimestamp = Date.parse(value) / 1000;
            //     //         currentQuery.whereRaw(`EXTRACT(EPOCH FROM (${pathStart}->>${pathEnd})::timestamp) ${comparator} ?`, [unixTimestamp]);
            //     //         break;
            //     //     }
            //     //     if(parentKey === '$len'){
            //     //         currentQuery.whereRaw(`jsonb_array_length(${pathStart}) ${comparator} ?`, [value]);
            //     //         break;
            //     //     }
            //     //     currentQuery.whereRaw(`(${pathStart}->>${pathEnd})::float ${comparator} ?`, [value]);
            //     //     break;
            //     // default:
            //     //     return currentQuery
            // }
            // return currentQuery
        // }
        

        
    }, knexQuery);
}

function bothArray(currentQuery, pathStart, pathEnd, operator, key, value){
    if (operator === '$any') {
        // The LHS array should contain any element from the RHS array.
        // This is equivalent to checking if the intersection of both arrays is non-empty.
        const randomString = "a" + Math.random().toString(36).substring(2, 7);
        currentQuery.whereExists(function() {
            this.select(client.raw('1'))
                .from(client.raw(`jsonb_array_elements_text((${pathStart}->${pathEnd})::jsonb) AS ${randomString}`))
                .whereRaw(`${randomString} IN (${value.map(() => '?').join(', ')})`, value);
        });        
        return;
        // console.log(currentQuery.toSQL())

    } else if (operator === '$all') {
        // The RHS array should be a subset of the LHS array.
        currentQuery.whereRaw(`(${pathStart}->${pathEnd}) @> ?::jsonb`, [JSON.stringify(value)]);
    }
}

function neitherArray(currentQuery, pathStart, pathEnd, operator, key, value, isValueNumeric){

    let comparator = ['=', '!=', '>', '>=', '<', '<=', 'like', 'not like', 'ilike', 'not ilike'][['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$like', '$notlike', '$ilike', '$notilike'].indexOf(key)]

    comparator = operator === '='?'=':comparator

    if(isValueNumeric){
        currentQuery.whereRaw(`(${pathStart}->>${pathEnd})::float ${comparator} ?::float`, [value]);
    }else{
        //checks it value is valid ISO date
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/;
        const isDate = isoDateRegex.test(value) && !isNaN(Date.parse(value));

        if(isDate){
            const unixTimestamp = Date.parse(value) / 1000;
            currentQuery.whereRaw(`EXTRACT(EPOCH FROM (${pathStart}->>${pathEnd})::timestamp) ${comparator} ?`, [unixTimestamp]);
        }else{
            currentQuery.whereRaw(`(${pathStart}->>${pathEnd})::text ${comparator} ?::text`, [value]);
        }
    }

}

function nestedFields(currentQuery, pathStart, pathEnd, operator, key, value, le){
    // always build a subquery
    const randomString = "a" + Math.random().toString(36).substring(2, 7);

    currentQuery.whereExists(function () {

            this.select(1)
                .from(client.raw(`jsonb_array_elements(${pathStart}->${le}) AS ${randomString}`))
                .where(function () { 
                    let nextKey = Object.keys(value)[0]
                    if(nextKey.startsWith('$')){
                        return knexify(this, value, randomString, [randomString], false);
                    }
                    return knexify(this, value, randomString, [randomString], true);
                })
    });

    return currentQuery                    

}

function rightHandArray(currentQuery, pathStart, pathEnd, operator, key, value){
            let comparator = ['like', 'not like', 'ilike','not ilike','=','!='][['$like[]', '$notlike[]', '$notilike[]', '$ilike[]','$in', '$nin'].indexOf(key)];
            currentQuery.whereRaw(
                `(${pathStart}->>${pathEnd})::text ${rh_comparator} ANY (array[${value.map(() => '?::text').join(', ')}])`,
                value.map(String)
            );
}


function leftHandArray(currentQuery, pathStart, pathEnd, operator, key, value){
    const isValueNumeric = !isNaN(parseFloat(value)) && isFinite(value);

    if(operator == '$contains'){
        currentQuery.whereExists(function() {
            this.select(client.raw('1'))
                .from(client.raw(`jsonb_array_elements_text(${pathStart}->${pathEnd}) AS elem`))
                .whereRaw('elem = ?', [String(value)]);
        });        
        return;
    }

    if(operator == '$len'){
        if(isObject(value)){
            // nested looking for $gte, $gt, $lte, $lt, $ne, $eq
            let nestedOperator = Object.keys(value)[0]
            let nestedValue = Object.values(value)[0]
            let comparator = ['>=', '>', '<=', '<', '!=', '='][['$gte', '$gt', '$lte', '$lt', '$ne', '$eq'].indexOf(nestedOperator)];
            if(!comparator){
                throw new Error(`Incorrect sub-operator for $len: ${nestedOperator}.`)
            }
            currentQuery.whereRaw(`jsonb_array_length(${pathStart}->${pathEnd}) ${comparator} ?`, [nestedValue]);            
        }else if(isValueNumeric){
            currentQuery.whereRaw(`jsonb_array_length(${pathStart}->${pathEnd}) = ?`, [value]);
        }else{
            throw new Error(`Incorrect right hand type or format for $len operator.`)
        }
    }
}


console.log('\n')
let index = 0; // Initialize an index counter
for await (let q of qoList){
    let a = aList[index];
    let builder = client('documents')
    let output = knexify(builder, q);

    console.log(
        output.toString()
            .replace(/and/g, '\nand')
            .replace(/exists \(select/g, 'exists (\n\tselect')
            .replace(/\)\)\)/g, '))\n)')
            .replace(/(AS [a-z0-9]{6}) where/g, '$1\n\twhere') + ';'
    );
    
    // Execute the query
    await output.then(result => {
        console.log('Query Result:', result.length);
        console.log('Expecting:', a);
        assert(result.length === a);
    }).catch(error => {
        console.error('Query Error:', error);
    });
    console.log('\n');
    index++;
}


