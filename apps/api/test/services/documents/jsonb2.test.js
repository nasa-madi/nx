import { Knex } from 'knex';
import assert from 'node:assert/strict';
import { describe, before, after, mock, it, test } from 'node:test';
import sinon from 'sinon';
import { KnexService } from '@feathersjs/knex';
import { create } from 'lodash';






describe('JSONB Test Cases for PostgreSQL Query Engine', function () {
    let consoleLogStub;


    before(async function () {
    //     // consoleLogStub = sinon.stub(console, 'log');
        await app.setup()



        

    //     let result = await app.service('documents').create({
    //         id: 100000,
    //         content: 'Hello world!',
    //         metadata: {
    //             authors: ["Alice Smith"],
    //             type: "Book",
    //             nested: {
    //                 level1: {
    //                     level2: {
    //                         entries: 11
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     { provider: undefined }
    //     ).catch(e => {
    //         console.error(e)
    //     })

    
    


    //     let result2 = await app.service('documents').create({
    //         id: 100001,
    //         content: 'Goodbye world!',
    //         metadata: {
    //             authors: ["Alice Smith"],
    //             type: "Article",
    //             nested: {
    //                 level1: {
    //                     level2: {
    //                         entries: 12
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     { provider: undefined }
    //     ).catch(e => {
    //         console.error(e)
    //     })
    //     return Promise.all([result, result2]);
    });

    // after(async function () {

    //     await app.service('documents').remove(100000).catch(e => {
    //         console.error(e)
    //     });
    //     await app.service('documents').remove(100001).catch(e => {
    //         console.error(e)
    //     });

    //     // Restore console.log
    //     consoleLogStub.restore();
    // });

    // test('should find documents with metadata.authors containing "Alice Smith"', async function () {
    //     const query = {
    //         metadata: {
    //             authors: ["Alice Smith"]
    //         }
    //     };

    //     app.service('documents').createQuery
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1));
    // });

    // it('should find documents with metadata.type being either "Book" or "Article"', async function () {
    //     const query = {
    //         metadata: {
    //             type: {
    //                 $in: ["Book", "Article"]
    //             }
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1));
    // });

    // it('should find documents with metadata.nested.level1.level2.entries containing any value greater than 10', async function () {
    //     const query = {
    //         metadata: {
    //             nested: {
    //                 level1: {
    //                     level2: {
    //                         entries: {
    //                             $gt: 10
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1));
    // });

    // it('should find documents with metadata.nested.level1.level2.comments where likes is greater than 3', async function () {
    //     const query = {
    //         metadata: {
    //             nested: {
    //                 level1: {
    //                     level2: {
    //                         comments: {
    //                             likes: {
    //                                 $gt: 3
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1));
    // });

    // it('should find documents with metadata.nested containing objects with arrays of mixed types, including numbers and objects', async function () {
    //     const query = {
    //         metadata: {
    //             nested: [
    //                 {
    //                     level1: [
    //                         {
    //                             level2: {
    //                                 data: [
    //                                     null,
    //                                     null,
    //                                     {
    //                                         deep: {
    //                                             $in: [100, 200]
    //                                         }
    //                                     }
    //                                 ]
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 2));
    // });

    // it('should find documents with metadata.tags containing all elements "science" and "technology"', async function () {
    //     const query = {
    //         metadata: {
    //             tags: {
    //                 $all: ["science", "technology"]
    //             }
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1));
    // });

    // it('should find documents with metadata.tags containing any of "math" or "science"', async function () {
    //     const query = {
    //         metadata: {
    //             tags: {
    //                 $in: ["math", "science"]
    //             }
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 1 || doc.id === 2));
    // });

    // it('should find documents with metadata.nested where level2.comments contain "Review"', async function () {
    //     const query = {
    //         metadata: {
    //             nested: [
    //                 {
    //                     level1: [
    //                         null,
    //                         {
    //                             level2: {
    //                                 comments: {
    //                                     $in: ["Review"]
    //                                 }
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     };
    //     const results = await queryDatabase(query);
    //     assert(results.some(doc => doc.id === 2));
    // });

    // Add more tests for edge cases as needed
});



import { Knex } from 'knex';
import { app } from '../../../src/app.js'
import assert from 'node:assert/strict';
import { describe, before, after, mock, it, test } from 'node:test';
import sinon from 'sinon';
import { KnexService } from '@feathersjs/knex';


class TestService extends KnexService{

    constructor(options) {
        super(options)
        this.options = options
    }   

    knexify(knexQuery, query = {}, parentKey) {
        const knexify = this.knexify.bind(this);
        return Object.keys(query || {}).reduce((currentQuery, key) => {
            const value = query[key];
            if (commons_1._.isObject(value) && !(value instanceof Date)) {
                return knexify(currentQuery, value, key);
            }
            const column = parentKey || key;
            const method = METHODS[key];
            if (method) {
                if (key === '$or' || key === '$and') {
                    // This will create a nested query
                    currentQuery.where(function () {
                        for (const condition of value) {
                            this[method](function () {
                                knexify(this, condition);
                            });
                        }
                    });
                    return currentQuery;
                }
                return currentQuery[method](column, value);
            }
            const operator = OPERATORS[key] || '=';
            return operator === '='
                ? currentQuery.where(column, value)
                : currentQuery.where(column, operator, value);
        }, knexQuery);
    }


    createQuery(params = {}) {
        const { name, id } = this.getOptions(params);
        const { filters, query } = this.filterQuery(params);
        const builder = this.db(params);
        // $select uses a specific find syntax, so it has to come first.
        if (filters.$select) {
            const select = filters.$select.map((column) => (column.includes('.') ? column : `${name}.${column}`));
            // always select the id field, but make sure we only select it once
            builder.select(...new Set([...select, `${name}.${id}`]));
        }
        else {
            builder.select(`${name}.*`);
        }
        // build up the knex query out of the query params, include $and and $or filters
        this.knexify(builder, {
            ...query,
            ...commons_1._.pick(filters, '$and', '$or')
        });
        // Handle $sort
        if (filters.$sort) {
            return Object.keys(filters.$sort).reduce((currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'), builder);
        }
        return builder;
    }
}




describe('documents service', () => {
    it('registered the service', () => {
        const service = app.service('documents')
        assert.ok(service, 'Registered the service')
    })
})

function queryDatabase(query) {
    return app.service('documents').find({ query });
}



// describe('JSONB Test Cases for PostgreSQL Query Engine', function () {
//     let consoleLogStub;


//     before(async function () {
//     //     // consoleLogStub = sinon.stub(console, 'log');
//         await app.setup()

//     //     let result = await app.service('documents').create({
//     //         id: 100000,
//     //         content: 'Hello world!',
//     //         metadata: {
//     //             authors: ["Alice Smith"],
//     //             type: "Book",
//     //             nested: {
//     //                 level1: {
//     //                     level2: {
//     //                         entries: 11
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     },
//     //     { provider: undefined }
//     //     ).catch(e => {
//     //         console.error(e)
//     //     })

    
    


//     //     let result2 = await app.service('documents').create({
//     //         id: 100001,
//     //         content: 'Goodbye world!',
//     //         metadata: {
//     //             authors: ["Alice Smith"],
//     //             type: "Article",
//     //             nested: {
//     //                 level1: {
//     //                     level2: {
//     //                         entries: 12
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     },
//     //     { provider: undefined }
//     //     ).catch(e => {
//     //         console.error(e)
//     //     })
//     //     return Promise.all([result, result2]);
//     });

//     // after(async function () {

//     //     await app.service('documents').remove(100000).catch(e => {
//     //         console.error(e)
//     //     });
//     //     await app.service('documents').remove(100001).catch(e => {
//     //         console.error(e)
//     //     });

//     //     // Restore console.log
//     //     consoleLogStub.restore();
//     // });

//     test('should find documents with metadata.authors containing "Alice Smith"', async function () {
//         const query = {
//             metadata: {
//                 authors: ["Alice Smith"]
//             }
//         };

//         app.service('documents').createQuery
//         const results = await queryDatabase(query);
//         assert(results.some(doc => doc.id === 1));
//     });

//     // it('should find documents with metadata.type being either "Book" or "Article"', async function () {
//     //     const query = {
//     //         metadata: {
//     //             type: {
//     //                 $in: ["Book", "Article"]
//     //             }
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 1));
//     // });

//     // it('should find documents with metadata.nested.level1.level2.entries containing any value greater than 10', async function () {
//     //     const query = {
//     //         metadata: {
//     //             nested: {
//     //                 level1: {
//     //                     level2: {
//     //                         entries: {
//     //                             $gt: 10
//     //                         }
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 1));
//     // });

//     // it('should find documents with metadata.nested.level1.level2.comments where likes is greater than 3', async function () {
//     //     const query = {
//     //         metadata: {
//     //             nested: {
//     //                 level1: {
//     //                     level2: {
//     //                         comments: {
//     //                             likes: {
//     //                                 $gt: 3
//     //                             }
//     //                         }
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 1));
//     // });

//     // it('should find documents with metadata.nested containing objects with arrays of mixed types, including numbers and objects', async function () {
//     //     const query = {
//     //         metadata: {
//     //             nested: [
//     //                 {
//     //                     level1: [
//     //                         {
//     //                             level2: {
//     //                                 data: [
//     //                                     null,
//     //                                     null,
//     //                                     {
//     //                                         deep: {
//     //                                             $in: [100, 200]
//     //                                         }
//     //                                     }
//     //                                 ]
//     //                             }
//     //                         }
//     //                     ]
//     //                 }
//     //             ]
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 2));
//     // });

//     // it('should find documents with metadata.tags containing all elements "science" and "technology"', async function () {
//     //     const query = {
//     //         metadata: {
//     //             tags: {
//     //                 $all: ["science", "technology"]
//     //             }
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 1));
//     // });

//     // it('should find documents with metadata.tags containing any of "math" or "science"', async function () {
//     //     const query = {
//     //         metadata: {
//     //             tags: {
//     //                 $in: ["math", "science"]
//     //             }
//     //         }
//     //     };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 1 || doc.id === 2));
//     // });

//     // it('should find documents with metadata.nested where level2.comments contain "Review"', async function () {
//         const query = {
//             metadata: {
//                 nested: [
//                     {
//                         level1: [
//                             null,
//                             {
//                                 level2: {
//                                     comments: {
//                                         $in: ["Review"]
//                                     }
//                                 }
//                             }
//                         ]
//                     }
//                 ]
//             }
//         };
//     //     const results = await queryDatabase(query);
//     //     assert(results.some(doc => doc.id === 2));
//     // });

//     // Add more tests for edge cases as needed
// });