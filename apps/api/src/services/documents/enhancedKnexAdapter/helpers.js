
import { _ } from '@feathersjs/commons';
export const {pick, isObject} = _;


// export function isObject(item) {
//     return typeof item === 'object' && !Array.isArray(item) && item !== null;
// }

export function constructJsonbPath(path, operator, isTextComparison = false) {
    const firstElement = path[0];
    let lastElement = path.length > 1 ? path[path.length - 1] : null;
    lastElement = isNaN(lastElement) ? `'${lastElement}'` : lastElement;
    const middlePath = path.length > 2 
        ? path.slice(1, -1).map(part => isNaN(part) ? `'${part}'` : part).join('->') 
        : null;
    return {firstElement, middlePath, lastElement};
}

export function bothArray(currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns) {
    if (operator === '$any') {
        const randomString = "a" + Math.random().toString(36).substring(2, 7);
        let Model = this.getModel();
        
        currentQuery.whereExists(function() {
            this.select(Model.raw('1'))
                .from(Model.raw(`jsonb_array_elements_text((${pathStart}->${pathEnd})::jsonb) AS ${randomString}`))
                .whereRaw(`${randomString} IN (${value.map(() => '?').join(', ')})`, value);
        });        
    } else if (operator === '$all') {
        currentQuery.whereRaw(`(${pathStart}->${pathEnd}) @> ?::jsonb`, [JSON.stringify(value)]);
    }
}

export function neitherArray(currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns) {
    let comparator = ['=', '!=', '>', '>=', '<', '<=', 'like', 'not like', 'ilike', 'not ilike']
        [['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$like', '$notlike', '$ilike', '$notilike'].indexOf(key)];
    
    comparator = operator === '=' ? '=' : comparator;
    const isValueNumeric = !isNaN(parseFloat(value)) && isFinite(value);

    if(isValueNumeric) {
        currentQuery.whereRaw(`(${pathStart}->>${pathEnd})::float ${comparator} ?::float`, [value]);
    } else {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/;
        const isDate = isoDateRegex.test(value) && !isNaN(Date.parse(value));

        if(isDate) {
            const unixTimestamp = Date.parse(value) / 1000;
            currentQuery.whereRaw(`EXTRACT(EPOCH FROM (${pathStart}->>${pathEnd})::timestamp) ${comparator} ?`, [unixTimestamp]);
        } else {
            currentQuery.whereRaw(`(${pathStart}->>${pathEnd})::text ${comparator} ?::text`, [value]);
        }
    }
}

export function nestedFields(currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns) {
    const randomString = "a" + Math.random().toString(36).substring(2, 7);
    let Model = this.getModel();

    currentQuery.whereExists(function () {
        this.select(1)
            .from(Model.raw(`jsonb_array_elements(${pathStart}->${le}) AS ${randomString}`))
            .where(function () { 
                let nextKey = Object.keys(value)[0];
                if(nextKey.startsWith('$')) {
                    return buildJsonbQuery(this, value, randomString, [randomString], false, jsonbColumns);
                }
                return buildJsonbQuery(this, value, randomString, [randomString], true, jsonbColumns);
            });
    });
}

export function rightHandArray(currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns) {
    let comparator = ['like', 'not like', 'ilike','not ilike','=','!=']
        [['$like[]', '$notlike[]', '$notilike[]', '$ilike[]','$in', '$nin'].indexOf(key)];
    currentQuery.whereRaw(
        `(${pathStart}->>${pathEnd})::text ${comparator} ANY (array[${value.map(() => '?::text').join(', ')}])`,
        value.map(String)
    );
}

export function leftHandArray(currentQuery, pathStart, pathEnd, operator, key, value, le, buildJsonbQuery, jsonbColumns) {
    const isValueNumeric = !isNaN(parseFloat(value)) && isFinite(value);
    let Model = this.getModel();
    const randomString = "a" + Math.random().toString(36).substring(2, 7);

    if(operator === '$contains') {

        if(isObject(value)) {
            let nestedOperator = Object.keys(value)[0];
            let nestedValue = Object.values(value)[0];
            let comparatorIndex = ['$like', '$notlike', '$notilike', '$ilike'].indexOf(nestedOperator);
            let comparator = ['like', 'not like', 'ilike','not ilike'][comparatorIndex];
            if(!comparator) {
                throw new Error(`Incorrect sub-operator for $contains: ${nestedOperator}.`);
            }
            currentQuery.whereExists(function() {
                this.select(Model.raw('1'))
                    .from(Model.raw(`jsonb_array_elements_text(${pathStart}->${pathEnd}) AS ${randomString}`))
                    .whereRaw(`${randomString} ${comparator} ?`, [nestedValue]);
            });       
        } else {
            currentQuery.whereExists(function() {
                this.select(Model.raw('1'))
                    .from(Model.raw(`jsonb_array_elements_text(${pathStart}->${pathEnd}) AS ${randomString}`))
                    .whereRaw(`${randomString} = ?`, [String(value)]);
            })
        }
    }

    if(operator === '$len') {
        if(isObject(value)) {
            let nestedOperator = Object.keys(value)[0];
            let nestedValue = Object.values(value)[0];
            let comparator = ['>=', '>', '<=', '<', '!=', '=']
                [['$gte', '$gt', '$lte', '$lt', '$ne', '$eq'].indexOf(nestedOperator)];
            if(!comparator) {
                throw new Error(`Incorrect sub-operator for $len: ${nestedOperator}.`);
            }
            currentQuery.whereRaw(`jsonb_array_length(${pathStart}->${pathEnd}) ${comparator} ?`, [nestedValue]);            
        } else if(isValueNumeric) {
            currentQuery.whereRaw(`jsonb_array_length(${pathStart}->${pathEnd}) = ?`, [value]);
        } else {
            throw new Error(`Incorrect right hand type or format for $len operator.`);
        }
    }
}