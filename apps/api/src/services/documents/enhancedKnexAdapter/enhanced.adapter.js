// enhanced-knex-service.js
import { KnexService } from '@feathersjs/knex';
import { buildJsonbQuery as bq } from './build-json-query.js';
import { pick } from './helpers.js';


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
            let updatedSelect = []
            //filter out any selects that are dot paths of jsonb columns, but if there are, make sure to include the base jsonbcolumn in the select
            if (this.jsonbColumns) {
                for (const column of this.jsonbColumns) {
                    for (const select of filters.$select) {
                        if (select.includes('.')) {
                            const dotPath = select.split('.')
                            if (dotPath[0] === column) {
                                updatedSelect.push(column)
                            }
                        }else{
                            updatedSelect.push(select)
                        }
                    }
                }
            }        

            const select = updatedSelect.map((column) => (column.includes('.') ? column : `${name}.${column}`));

            // always select the id field, but make sure we only select it once
            builder.select(...new Set([...select, `${name}.${id}`]));
        }else{
            builder.select(`${name}.*`)
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
        if(this.allowJsonbSelects){
            
            const { filters, query } = this.filterQuery(params)
            let selectedJsonbPaths = []
            let updatedSelect = []

            //since $select will include dot paths for jsonb columns, we need to handle that here
            if (filters.$select) {
                for (const column of filters.$select) {
                    if (column.includes('.')) {
                        const dotPath = column.split('.')
                        if(!updatedSelect.includes(dotPath[0]) && this.jsonbColumns.includes(dotPath[0])){
                            updatedSelect.push(dotPath[0])
                        }
                        if(!selectedJsonbPaths.includes(column)){
                            selectedJsonbPaths.push(dotPath.slice(1).join('.'))
                        }
                    }else{
                        updatedSelect.push(column)
                    }
                }

                // required to ensure resolver uses updated select
                params.query.$select = updatedSelect

                // required to ensure resolver uses updated select
                params.resolve.properties = updatedSelect;
            
                for (let i = 0; i < results.data.length; i++) {
                    // For each result, only pick the fields in the jsonb columns that are selected
                    // selectedJsonbPaths is an array of dot paths like ['metadata.type', 'metadata.user.details.list[0]']
                    if (this.jsonbColumns) {
                        for (const column of this.jsonbColumns) {
                            const columnData = results.data[i][column];
                            if (columnData) {
                                // Ensure that we are picking the correct nested fields
                                results.data[i][column] = pick(columnData, selectedJsonbPaths);
                            }
                        }
                    }
                }
            }
        }
        return results
    }   
}