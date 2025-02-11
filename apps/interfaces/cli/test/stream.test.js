// import { expect } from 'chai';
// // import { handleDeltas, mergeDelta } from '../index.js';
// import { getProperty, setProperty, hasProperty, deleteProperty } from 'dot-prop';


// /*
// You are an advanced, qualified javascript and nodeJS developer.

// You need to write functions that can build a response object based on a stream of json chunks sent back to the function.
// The functions will process one chunk at a time.
// The changes for the response object are defined in the "delta" field of the streamed chunks.
// For certain fields, however, the chunks can't be overwritten, they must be appened.  Those fields are described in the array of "concatenatedFields".  The strings of the field locations use [*] instead of a specific array index because it applies to all elements of the array and not a specific index.

// Also, the chunks return arrays, but the objects in the chunk arrays (even nested ones) aren't in the right spots.  Instead the objects have an "index" field that describe which index that object is supposed to be at in it's parent array.  

// Here's an example of a set of chunks that are streamed to the function
// {"choices":[{"index":0,"delta":{"content":" Doe","age":"25"}}]},{"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"name":"get_weather","arguments":"a"}}]}}]},{"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"name":"get_weather","arguments":"a"}}]}}]},{"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"b"}}]}}]},{"choices":[{"index":0,"delta":{"otherArray":[{"index":0,"function":{"arguments":"c"}}]}}]}

// Here's the parameters to describe the stream:
// ```
// let deltaPaths = [
//     'choices[*].delta',
// ]
// let concatenatedPaths =[
//     'choices[*].content',
//     'choices[*].tool_calls[*].function.arguments'
// ]
// ```
// Here's an example of the completed resopnse object that should be created at the end of processing:
// ```
// {
//     "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
//     "system_fingerprint": "fp_a24b4d720c",
//     "choices": [
//         {
//             "index": 0,
//             "role": "assistant",
//             "content": "John Doe",
//             "age": '25',
//             "finish_reason": null,
//             "otherArray": [
//                 {
//                     "index":0,
//                     "function": {
//                     "arguments": "c"
//                     }
//                 }
//             ],
//             "tool_calls": [
//                 {
//                     "index":0,
//                     "function":{
//                         "name":"get_weather",
//                         "arguments":"ab"
//                     }
//                 }
//             ]
//         }
//     ]
// }
// ```

// */

// export function mergeDelta(deltaObj, parentKey, response, concatenatedFields = []) {
//     const { index, delta = {} } = deltaObj;

//     const parentArray = getProperty(response, parentKey) || [];
//     let objectToUpdate = parentArray[index] || {};

//     for (let key in delta) {
//         if (concatenatedFields.includes(key) && objectToUpdate[key]) {
//             objectToUpdate[key] += delta[key];
//         } else {
//             objectToUpdate[key] = delta[key];
//         }
//     }
//     parentArray[index] = objectToUpdate;
//     setProperty(response, parentKey, parentArray);
// }

// export function handleDeltas(object, response, parentKey = '', concatenatedFields = []) {
//     if (object?.delta) {
//         mergeDelta(object, parentKey, response, concatenatedFields);
//     }

//     for (let key in object) {
//         const newParentKey = parentKey ? `${parentKey}[${key}]` : key; 
//         // Important to include square brackets around the key in the path to work well with dot prop getter

//         if (Array.isArray(object[key])) {
//             for (let [index, obj] of object[key].entries()){ 
//                 // Addition of .entries() ensures that only objects inside the array get iterated and nested attributes within get processed accurately.
//                 const newKey = `${newParentKey}.${index}`; 
//                 // Use . instead of [] to create new key for dot prop getter to work properly

//                 if(obj.delta){
//                     mergeDelta(obj, newKey, response, concatenatedFields);
//                 }

//                 if (typeof obj === 'object') {
//                   handleDeltas(obj, response, newKey, concatenatedFields);
//                 }
//             }
//         } else if (typeof object[key] === 'object') {
//             handleDeltas(object[key], response, newParentKey, concatenatedFields);
//         }
//     }
// }


// describe('handleDeltas', () => {
//     it('should properly handle delta updates', () => {
//         const response = {
//             "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
//             "system_fingerprint": "fp_a24b4d720c",
//             "choices": [
//                 {
//                     "index": 0,
//                     "role": "assistant",
//                     "content": "John",
//                     "age": 28,
//                     "finish_reason": null,
//                     "tool_calls": [{}]
//                 }
//             ]
//         };
//         let chunks = [
//             {
//             choices:[
//                 {
//                     index: 0,
//                     delta: {
//                         content: ' Doe',
//                         age: '25'
//                     }
//                 }
//             ]},
//             {choices:[
//                 {
//                     index: 0,
//                     "delta": {
//                         "tool_calls": [
//                           {
//                             "index": 0,
//                             "function": {
//                               "name":"get_weather",
//                               "arguments": "a"
//                             }
//                           }
//                         ]
//                     },
//                 },
//             ]},
//             {choices:[
//                 {
//                     index: 0,
//                     "delta": {
//                         "tool_calls": [
//                           {
//                             "index": 0,
//                             "function": {
//                               "name":"get_weather",
//                               "arguments": "a"
//                             }
//                           }
//                         ]
//                     },
//                 },
//             ]},
//             {choices:[
//                 {
//                     index: 0, 
//                     "delta": {
//                         "tool_calls": [
//                           {
//                             "index": 0,
//                             "function": {
//                               "arguments": "b"
//                             }
//                           }
//                         ]
//                     },
//                 },
//             ]},
//             {choices:[
//                 {
//                     index: 0, 
//                     "delta": {
//                         "otherARray": [
//                           {
//                             "index": 0,
//                             "function": {
//                               "arguments": "c"
//                             }
//                           }
//                         ]
//                     },
//                 } 
//             ]}

            
            
   
//         ]


//         let deltaPaths = [
//             'choices[*].delta',
//         ]
//         let concatenatedPaths =[
//             'choices[*].content',
//             'choices[*].tool_calls[*].function.arguments'
//         ]

//         for (const chunk of chunks ){
//             handleDeltas(response, chunk, deltaPaths, concatenatedPaths)

//         }
//         console.log(JSON.stringify(response, null, 2))

//         expect(response).to.deep.equal({
//             "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
//             "system_fingerprint": "fp_a24b4d720c",
//             "choices": [
//                 {
//                     "index": 0,
//                     "role": "assistant",
//                     "content": "John Doe",
//                     "age": '25',
//                     "finish_reason": null,
//                     "otherARray": [
//                         {
//                           "index":0,
//                           "function": {
//                             "arguments": "c"
//                           }
//                         }
//                     ],
//                     "tool_calls": [
//                         {
//                             "index":0,
//                             "function":{
//                                 "name":"get_weather",
//                                 "arguments":"ab"
//                             }
//                         }
//                     ]
//                 }
//             ]
//         });
//     });
// });
