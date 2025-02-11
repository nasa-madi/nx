
import assert from 'node:assert/strict';
import { describe, before, after, it, test } from 'node:test';
import { service } from './helpers.js';
import { extractQueryComponents } from './helpers.js'; // Adjust the path as necessary


/*** EXAMPLE DATA IN THE DB */
// {
//     "type": "Book",
//     "nested": {
//       "level1a": {
//         "level2a": {
//           "entries": 11
//         }
//       },
//       "level1b": [
//         {
//           "a": "b",
//           "n": 10
//         },
//         {
//           "a": "b",
//           "n": 10,
//           "list": [
//             0,
//             1,
//             2,
//             3
//           ],        
//           "list2":[
//            {"c":100},
//            {"c":101,"d":"e"}
//           ]
//         }
//       ]
//     },
//     "authors": [
//       "Charlie Brown",
//       "Dana White",
//       "Alice Smith"
//     ]
// }



describe('extractQueryComponents', () => {
    it('should extract operator and value from a simple object', () => {
        const query = { $eq: 5 };
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: 5,
            operator: '$eq',
            path: []
        });
    });

    it('should extract operator and value from a nested object', () => {
        const query = { nested: { $gt: 10 } };
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: 10,
            operator: '$gt',
            path: ['nested']
        });
    });

    it('should handle arrays and extract the first non-object value', () => {
        const query = [{ $lt: 3 }, { $eq: 5 }];
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: 3,
            operator: '*',
            path: [0]
        });
    });

    it('should handle deeply nested structures', () => {
        const query = { level1: { level2: { $lte: 20 } } };
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: 20,
            operator: '$lte',
            path: ['level1', 'level2']
        });
    });

    it('should return default result for empty query', () => {
        const query = {};
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: null,
            operator: null,
            path: []
        });
    });

    it('should handle complex nested arrays', () => {
        const query = { level1: { $in: [1, 2, 3] } };
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: [1, 2, 3],
            operator: '$in',
            path: ['level1', 0]
        });
    });

    it('should handle complex nested arrays', () => {
        const query = { level1: [{ '*': [1, 2, 3] }, { $ne: 4 }] };
        const result = extractQueryComponents(query);
        assert.deepStrictEqual(result, {
            value: [1, 2, 3],
            operator: '$in',
            path: ['level1', 0]
        });
    });
});

// Test cases
describe('JSONB Test Cases for PostgreSQL Query Engine', function () {

    test('should find documents with * operator for array values', async function () {
        const query = {
            'metadata': {
                'authors': {
                    '*': "Alice Smith"
                }
            }
        };
        const results = await service.find({ query }).catch(e=>{
            console.error(e)
        })
        assert(results.length === 2);
    });

    it('should find documents using nested $in', async function () {
        const query = {
            metadata: {
                type: {
                    $in: ["Book", "Research Tool"]
                }
            }
        };
        const results = await service.find({ query }).catch(e=>{console.error(e);});
        assert(results.length == 2);
    });

    describe('should find documents using nested * operator', function () {
        it('should find documents using nested * and *', async function () {
            const query = {
                metadata: { 
                    nested:{
                        level1b: {
                            '*': {
                                list:{   
                                    '*':1
                                }
                            }
                        }
                    }
                }
            };
            const results = await service.find({ query }).catch(e=>{
                console.error(e)
            })
            assert(results[0].id === 100001);
            assert(results.length === 1);
        })
        it ('should find documents using nested * and $in', async function () {
            const query = {
                metadata: {
                    nested: {
                        level1b: {
                            '*': {
                                n: {
                                    $in: [10, 11, 12]
                                }
                            }
                        }
                    }
                }
            };
            const results = await service.find({ query }).catch(e=>{
                console.error(e)
            })
            assert(results[0].id === 100001);
            assert(results.length === 1);
        })
    //     it ('should find documents using nested * and $gt', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $gt: 9
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documents using nested * and $gte', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $gte: 10
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documents using nested * and $lt', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $lt: 11
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documents using nested * and $lte', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $lte: 10
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })

    //     it ('should find documents using nested * and $neq', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $neq: 10
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documents using nested * and $eq', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             n: {
    //                                 $eq: 10
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documents using nested * and implicit =', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': { 
    //                             n:  10
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    //     it ('should find documentsusing triple nested *', async function () {
    //         const query = {
    //             metadata: {
    //                 nested: {
    //                     level1b: {
    //                         '*': {
    //                             list: {
    //                                 '*': {
    //                                     n: 10
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         const results = await service.find({ query }).catch(e=>{
    //             console.error(e)
    //         })
    //         assert(results.length >= 0);
    //     })
    });
    
   













        
        // test('should find documents with plugin Advanced Tool', async function () {
        //     const query = {
        //         plugin: 'Advanced Tool'
        //     };
        //     const results = await service.find({ query }).catch(e=>{
        //         console.error(e)
        //     })
        //     console.log(results)
        //     assert(results[0].plugin === 'Advanced Tool');
    // });
        
        // test('should find documents with metadata.authors containing "Alice Smith"', async function () {
        //     const query = {
        //         'metadata.authors': ["Alice Smith"]
        //     };
        //     const results = await service.find({ query }).catch(e=>{
        //         console.error(e)
        //     })
        //     assert(results.length == 0)
        //     // console.log(results)
        //     // assert(results[0].author === 'Advanced Tool');
        //     // assert(results.some(doc => doc.id === 1));
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
        
        // Add more tests as needed
});
