// enhanced-knex-service.js
import { KnexService } from '@feathersjs/knex';
import { buildJsonbQuery as bq } from './build-json-query.js';
import { pick } from './helpers.js';
import { flatten, unflatten } from 'flat'



export class EnhancedKnexService extends KnexService {
    constructor(options) {
        super(options);
        this.embeddingName = options.embeddingName
        // this.buildJsonbQuery = bq.bind(this)
        this.allowJsonbSelects = options.allowJsonbSelects ?? true
    }

    async setup(app) {
        let options = this.getOptions(app)
        // set to 'auto' to auto-check
        // set to [], null, or undefined to disable
        if (options.jsonbColumns === 'auto') {
            this.jsonbColumns = await this.getJsonbColumns(this.Model, this.getOptions(app).name);
        }else{
            this.jsonbColumns = options.jsonbColumns
        }
        this.buildJsonbQuery = bq.bind(this)
    }

    async getJsonbColumns(knex, tableName) {
        const result = await knex('information_schema.columns')
            .select('column_name')
            .where({
                table_name: tableName,
                data_type: 'jsonb'
            }).catch((error) => {
                console.error('Error fetching JSONB columns:', error);
            });
        return result.map(row => row.column_name);
    }

    knexify(knexQuery, query = {}, parentKey) {

        // Then apply JSONB query building
        knexQuery = this.buildJsonbQuery(knexQuery, query, parentKey, [], false, this.jsonbColumns || [])

        return knexQuery;
    }

    buildSearchSelect(params) {
        if (params.embedding) {
            // If $search is provided, append the cosine_distance to the select fields
            if(!this.embeddingName){
                throw new Error('Embedding name is required');
            }
            let search = this.Model.raw('cosine_distance(?, ?) as _distance', [this.embeddingName, params.embedding]);

            return search
        }else{
            return ''
        }
    }

    modifySearchFilters(params, searchSelect){
        if(params.query?.$search){
            if (params.query?.$select) {
                // Append _distance to the existing $select array
                params.query.$select.push(searchSelect);
            } else {
                // If no $select is provided, select all fields and append _distance
                // params.query.$select = ['*'];
            }
        }
    }

    modifySortFilters(params){
        if(params.query?.$search){
            // Set default sort for _distance if not provided
            if (!params.query.$sort || !params.query.$sort._distance) {
                params.query.$sort = params.query.$sort || {};
                params.query.$sort._distance = -1; // Default to descending
            }
        }
    }



    createQuery(params={}) {
        const builder = this.db(params)

        const searchSelect = this.buildSearchSelect(params, builder);

        this.modifySearchFilters(params, searchSelect)

        this.modifySortFilters(params)

        const { name, id } = this.getOptions(params)
        const { filters, query } = this.filterQuery(params)

        // Handle $select parameter and ensure the id field is selected
        if (filters.$select) {
            let columnsToSelect = new Set([`${name}.${id}`]); // Start with id

            // Process each select, including full jsonb columns when nested fields are requested
            for (const select of filters.$select) {
                if (select.includes('.')) {
                    const [baseColumn] = select.split('.');
                    if (this.jsonbColumns?.includes(baseColumn)) {
                        columnsToSelect.add(`${name}.${baseColumn}`);
                    }
                } else {
                    columnsToSelect.add(`${name}.${select}`);
                }
            }

            builder.select(...columnsToSelect);
        } else {
            builder.select(`${name}.*`);
        }

        // remove the $search param
        query.$search && delete query.$search

        // build up the knex query out of the query params, include $and and $or filters
        this.knexify(builder, {
            ...query,
            ...pick(filters, '$and', '$or')
        });
        
        // Handle $sort
        if (filters.$sort) {
            return Object.keys(filters.$sort).reduce(
                (currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'),
                builder
            )
        }
  
      return builder
    }

    async _find(params = {}) {
        if(params.query.$search){
            let embedding = await this.options.chunks.fetchEmbedding(params.query.$search)
            params.embedding = embedding
        }
        let results = await super._find(params)
        
        if (this.allowJsonbSelects && params.query.$select) {
            const { filters } = this.filterQuery(params);
            
            if (results.data?.length) {
                results.data = results.data.map(record => {
                    const filteredRecord = { ...record };
                    
                    // Process each jsonb column
                    for (const column of this.jsonbColumns || []) {
                        if (filteredRecord[column]) {
                            // need to add the column to the params if it is not already there
                            if (!filters.$select?.includes(column)) {
                                filters.$select = filters.$select || [];
                                filters.$select.push(column);
                            }

                            // Flatten the JSONB object
                            const flatObj = flatten(filteredRecord[column]);
                            
                            // Get all relevant paths from $select that start with this column
                            const relevantPaths = filters.$select
                                .filter(s => s.startsWith(`${column}.`))
                                .map(s => s.substring(column.length + 1));
                            
                            if (relevantPaths.length) {
                                // Create an object to store matched paths
                                const filtered = {};
                                
                                // For each key in the flattened object
                                Object.keys(flatObj).forEach(key => {
                                    // Check if any relevantPath is a prefix of this key
                                    // This will match both exact paths and array indices
                                    if (relevantPaths.some(path => 
                                        key === path || // exact match
                                        key.startsWith(`${path}.`) || // nested property
                                        /^\d+$/.test(key.substring(path.length + 1)) // array index
                                    )) {
                                        filtered[key] = flatObj[key];
                                    }
                                });
                                
                                // Unflatten back to nested structure
                                filteredRecord[column] = filtered ? unflatten(filtered) : record[column];
                            }
                        }
                    }
                    
                    return filteredRecord;
                });
            }
        }

        return results;
    }   
}