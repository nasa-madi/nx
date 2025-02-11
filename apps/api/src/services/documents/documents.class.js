import pMap from 'p-map'
import { SbdSplitter } from 'sbd-splitter';
import config from '@feathersjs/configuration'
import { EnhancedKnexService } from './enhancedKnexAdapter/enhanced.adapter.js';
import { BadRequest } from '@feathersjs/errors';

export const METHODS = {
    $ne: 'whereNot',
    $in: 'whereIn',
    $nin: 'whereNotIn',
    $or: 'orWhere',
    $and: 'andWhere'
};

export const OPERATORS = {
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
    $like: 'like',
    $notlike: 'not like',
    $ilike: 'ilike'
};

const SIZE = config()().chunks.size || 2000

export class DocumentService extends EnhancedKnexService {

  constructor(options) {
    super(options)
    this.options = options
  }

  async splitDoc(document){
    const splitter = new SbdSplitter({
      chunkSize: SIZE,
      softMaxChunkSize: 3000,
      delimiters: [
          '\n# ',
          '\n## ',
          '\n### ',
          '\n#### ',
          '\n##### ',
          '\n###### ',
          '```\n\n',
          '\n\n***\n\n',
          '\n\n---\n\n',
          '\n\n___\n\n',
          '\n\n',
          '\n',
          '&#&#&#',
          ' ',
          ''
      ]
    });
    let result = await splitter.splitText(document)    
    return result.map((r, i) => {
      return {
        pageContent: r,
        metadata: {
          loc: {lines: {from: i, to: i}},
          chunkIndex: i,
          chunkSize: r.length,
        }
      }
    })
  }


  async create(data, params){

    let newDoc = await this._create(data, params)
    
    // allows raw content to be passed in when uploadPath is being used instead of content
    let content = params.rawContent || data.content
    
    try{
      let chunks = await this.splitDoc(content)

      // uses pMap to limit concurrent chunks to 10.
      // TODO convert to a pubsub or queue
      const mapper = (c, index) => {
          return this.options.chunks.create({
            pageContent: c.pageContent,
            metadata: c.metadata,
            documentId: newDoc.id,
            documentIndex: index,
            plugin: newDoc.plugin || undefined,
      }, {...params, provider:'internal'});
    }
      await pMap(chunks, mapper, {concurrency: 10});
    }catch(e){
      await this.remove(newDoc.id)
      console.error(e)
      throw e
    }
    return newDoc
  }


  async remove(id, params) {
    // Delete all chunks where 'documentId' is equal to 'id'
    await this.options.chunks.getModel().from('chunks').where('documentId', id).del();

    // Remove the document
    // TODO fix this logic.  With CASL it binds the query: {userId: user.id} to the underlying findOrGet and returns a Not Found instead of a Forbidden.
    let newDoc = await this._remove(id, params);

    return newDoc;
  }

  /**
   * 
   * @param {Object} params - The request parameters
   * @description
   * Builds a query that searches for documents using the cosine distance of the nearest
   * chunk as the representative of the document's value. Uses a subquery to find the
   * nearest chunk and then joins it to the documents table. The document's value is
   * then the minimum cosine distance of all of its chunks. The results are ordered
   * by this value in ascending order.
   * @todo
   * Add the ability to average the chunk distances or to use the median chunk distance
   * as the document's value.
   * @todo
   * Add the ability to return the top 10% of chunks as the document's value.
   * @todo
   * Add the ability to order the results by the nearest chunk's cosine distance in
   * descending order.
   */
  buildSearchSelect(params, builder) {
    if (params.embedding) {
      const subquery = this.options.chunks
        .getModel()
        .from('chunks')
        .select(
          this.getModel().raw('json_build_object(\'pageContent\', "chunks"."pageContent", \'metadata\', "chunks"."metadata") as chunk'),
          "documentId",
          this.getModel().cosineDistanceAs('embedding', params.embedding, '_distance')
        )
        .distinctOn('chunks.documentId')
        .orderBy(['chunks.documentId', '_distance']);

        //TODO Build an AVERAGE chunk distance or a MEDIAN chunk distance or a TOP 10% chunk distance (Avg of window)
      builder.leftJoin(subquery.as('sub'), 'documents.id', 'sub.documentId')
      
      return 'sub._distance as _distance'
      // return this.Model.raw('sub._distance', 'sub.chunk')

    }
    return ''
  }

  
  // async _find(params){
  //   console.log('params',params)
  //   const { filters, paginate } = this.filterQuery(params);
  //   const { name, id='id' } = this.getOptions(params);
  //   let search = null
  //   let distanceDirection = 'asc'



  //   // Extract and remove custom query parameters

  //   if(params?.query?.$search){
  //     search = params?.query?.$search;
  //     delete params.query.$search
  //     if(params?.query?.$direction){
  //         distanceDirection = params.query.$direction === 'desc' ? 'desc' : 'asc';
  //     }
  //   }


  //   const builder = params.knex ? params.knex.clone() : this.createQuery(params);

  //   // TODO Needs a better filter.  Numeric values like 2, become string '2' which prevents the _filter from work on numeric values. This is resolved with the custom decoder with koa-qs in src/app.js
  //   jsonFilterResolver(builder, params, this.getModel())

  //   jsonSelectResolver(builder, params, this.getModel())

  //   // console.log(builder.toSQL())

  //   // TODO This should be pulled out as a separate RAG service on the /search endpoint. But this is a placeholder for now.
  //   if (search) {
  //       let embedding = await this.options.chunks.fetchEmbedding(search);

  //       // takes the cosine distance of the nearest doucment chunk as representative of the document's value
  //       const subquery = this.options.chunks
  //         .getModel()
  //         .from('chunks')
  //         .select(
  //           this.getModel().raw('json_build_object(\'pageContent\', "chunks"."pageContent", \'metadata\', "chunks"."metadata") as chunk'),
  //           "documentId",
  //           this.getModel().cosineDistanceAs('embedding', embedding, '_distance')
  //         )
  //         .distinctOn('chunks.documentId')
  //         .orderBy(['chunks.documentId', '_distance']);

  //       //TODO Build an AVERAGE chunk distance or a MEDIAN chunk distance or a TOP 10% chunk distance (Avg of window)

  //       builder.select('documents.*','sub._distance', 'sub.chunk')
  //       builder.leftJoin(subquery.as('sub'), 'documents.id', 'sub.documentId')
  //       builder.orderBy('_distance', distanceDirection);
  //   }


  //   const countBuilder = builder
  //       // .clone()
  //       // .clearSelect()
  //       // .clearOrder()
  //       // .count(`${name}.${id} as total`);
    
  //   // Handle $limit
  //   if (filters.$limit) {
  //       builder.limit(filters.$limit);
  //   }
  //   // Handle $skip
  //   if (filters.$skip) {
  //       builder.offset(filters.$skip);
  //   }
  //   // provide default sorting if its not set
  //   if (!filters.$sort && !search && builder.client.driverName === 'mssql') {
  //       builder.orderBy(`${name}.${id}`, 'asc');
  //   }

  //   //TODO Swallows an error here.  Needs to bubble up appropriately.
  //   const data = filters.$limit === 0 ? [] : await builder.catch(e=>{console.log(e)});
  //   if (paginate && paginate.default) {
  //       // const total = await countBuilder.then((count) => parseInt(count[0] ? count[0].total : 0));
  //       const total = 0
  //       return {
  //           total,
  //           limit: filters.$limit,
  //           skip: filters.$skip || 0,
  //           data
  //       };
  //   }
  //   return data;
  // }

  async getTypes(data, params) {
    let knex = this.getModel()
          try {
        const result = await knex.raw(`
          SELECT DISTINCT metadata->>'type' AS type
          FROM documents
          WHERE metadata->>'type' IS NOT NULL
        `);
    
        return result?.rows?.map((row) => row?.type)
      } catch (error) {
        console.error('Error fetching unique metadata types:', error);
      }
    }

  // async setup(app){
  //   this.jsonbColumns = [];
  //   this.jsonbColumns = await this.getJsonbColumns(this.Model, 'documents');
  // }

  // isJsonBColumn(column) {
  //   return this.jsonbColumns.includes(column.split('.')[0]);
  // }

  // async getJsonbColumns(knex, tableName) {
  //   const result = await knex('information_schema.columns')
  //     .select('column_name')
  //     .where({
  //       table_name: tableName,
  //       data_type: 'jsonb'
  //     }).catch((error) => {
  //       console.error('Error fetching unique metadata types:', error);
  //     })
  //   return result.map(row => row.column_name);
  // }

}


// export class JsonbKnexService extends KnexService {
//   knexify(knexQuery, query = {}, parentKey, path = [], nested = false) {
//       // First apply the standard knexify logic
//       knexQuery = super.knexify(knexQuery, query, parentKey);
      
//       // Then apply the JSONB-specific logic
//       return buildJsonbQuery(knexQuery, query, parentKey, path, nested);
//   }
// }


export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'documents',
    id: 'id',
    chunks: app.service('chunks'),
    jsonbColumns: 'auto',  // Required for nested metadata searching
    allowJsonbSelects: true
  }
}