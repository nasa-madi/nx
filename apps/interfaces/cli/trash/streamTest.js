import {getProperty, setProperty, hasProperty, deleteProperty} from 'dot-prop';


let streamArray = [
    {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "role": "assistant",
              "content": null
            },
            "finish_reason": null
          }
        ]
      },
    {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "content": 'Hello'
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "content": '! I am here.'
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "id": "call_erCWie3J9o7xIxONsWfDmZMu",
                  "type": "function",
                  "function": {
                    "name": "get_current_weather",
                    "arguments": ""
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "{\"lo"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "catio"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "n\": \"S"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "an F"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "ranci"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "sco, C"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "A\"}"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "id": "call_0h1B1eU1DzChsReYCa3JYjkf",
                  "type": "function",
                  "function": {
                    "name": "get_current_weather",
                    "arguments": ""
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "{\"lo"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "catio"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "n\": \"T"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "okyo"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": ", Jap"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "an\"}"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "id": "call_qv6BiYg93fNJroffuKY1bqjf",
                  "type": "function",
                  "function": {
                    "name": "get_current_weather",
                    "arguments": ""
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": "{\"lo"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": "catio"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": "n\": \"P"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": "aris"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": ", Fra"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 2,
                  "function": {
                    "arguments": "nce\"}"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {},
            "finish_reason": "tool_calls"
          }
        ]
      }
]  

let streamArray2 = [
    {
        "id": "chatcmpl-8OpG974Gu4GEU0FEFfAcqS6I6kv73",
        "object": "chat.completion.chunk",
        "created": 1700927605,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "role": "assistant",
              "content": ""
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpG974Gu4GEU0FEFfAcqS6I6kv73",
        "object": "chat.completion.chunk",
        "created": 1700927605,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "content": "The"
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpG974Gu4GEU0FEFfAcqS6I6kv73",
        "object": "chat.completion.chunk",
        "created": 1700927605,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "content": " current"
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpG974Gu4GEU0FEFfAcqS6I6kv73",
        "object": "chat.completion.chunk",
        "created": 1700927605,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {},
            "finish_reason": "stop"
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "role": "assistant",
              "content": null
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "id": "call_erCWie3J9o7xIxONsWfDmZMu",
                  "type": "function",
                  "function": {
                    "name": "get_current_weather",
                    "arguments": ""
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 0,
                  "function": {
                    "arguments": "{\"lo"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
      {
        "id": "chatcmpl-8OpESorD5GpJPO8gV85tsrQPLrGNz",
        "object": "chat.completion.chunk",
        "created": 1700927500,
        "model": "gpt-4-1106-preview",
        "system_fingerprint": "fp_a24b4d720c",
        "choices": [
          {
            "index": 0,
            "delta": {
              "tool_calls": [
                {
                  "index": 1,
                  "function": {
                    "arguments": "catio"
                  }
                }
              ]
            },
            "finish_reason": null
          }
        ]
      },
]

let final = {
    "id": "chatcmpl-8OpG974Gu4GEU0FEFfAcqS6I6kv73",
    "object": "chat.completion.chunk",
    "created": 1700927605,
    "model": "gpt-4-1106-preview",
    "system_fingerprint": "fp_a24b4d720c",
    "choices": [
        {

            "index": 0,
            "role":"assistant",
            "content": "The current",
            "finish_reason":"stop",
            "tool_calls":[
                {
                    "index":0,
                    "id": "call_erCWie3J9o7xIxONsWfDmZMu",
                    "type": "function",
                    "function": {
                      "name": "get_current_weather",
                      "arguments": "{\"locatio"
                    }
                }
            ]
        }
    ]
}


// function mergeStreamedObjects(array) {
//     let mergeObject = {}
//     array.forEach(obj => {
//       let choice = obj.choices[0]
//       // append for choices[].delta.content
//         if (choice.delta.hasOwnProperty("content")) {
//             if (!mergeObject.hasOwnProperty("content")) 
//                 mergeObject.content = "";
            
//             mergeObject.content += choice.delta.content;
//         }
//     //   // append for delta.tool_calls[].function.arguments
//       if (choice.delta.tool_calls) {
//         if (!mergeObject.tool_calls) mergeObject.tool_calls = []
//         let callIndex = mergeObject.tool_calls.findIndex(call => call.index === choice.delta.tool_calls[0].index)
//         if (~callIndex) {
//           mergeObject.tool_calls[callIndex].function.arguments += choice.delta.tool_calls[0].function.arguments
//         } else {
//           mergeObject.tool_calls.push(choice.delta.tool_calls[0])
//         }
//       }
//       else {
//         mergeObject = {...mergeObject, ...choice.delta }
//       }
    
//     })
//     return mergeObject
// }

// let merged = mergeStreamedObjects(streamArray2);
// console.log(JSON.stringify(merged, null, 2));















    
    // let ci = getProperty(chunk, `choices[0].index`)
    // let cd = getProperty(chunk, `choices[0].delta`)
    // let oldContent = getProperty(response, `choices[${ci}].content`)
    // let newContent = getProperty(chunk, `choices[0].delta.content`)



    /**
     * Iterate through properties
     * Is it an array?
     * YES.
     *      does it have a delta and an index?
     *      YES - merge object in array with the bas ob
     * NO - overwrite to reponse
     * 
     * 
     * 
     */

    // setProperty(response, `choices[${ci}]`, {
    //     ...cd,
    //     content: oldContent += newContent
    // })
    // response.choices[ci] = {...response.choices[ci], content: oldContent += newContent}

    // let ti = getProperty(chunk, `choices[0].delta.tool_calls[0].index`)
    // let td = getProperty(chunk, `choices[0].delta.tool_calls[0].delta`)
    // if(ti>-1){
    //     let oldArgument = getProperty(response, `choices[${ci}].tool_calls[${ti}].function.argument`)
    //     let newArgument = getProperty(chunk, `choices[0].delta.tool_calls[0].function.argument`)
    //     setProperty(response, `choices[${ci}].tool_calls[${ti}]`, {
    //         ...td,
    //         arguments: oldArgument += newArgument
    //     })
    //     console.log(chunk, ci,ti, newContent, newArgument)

    // }



 


    // // Merging choices
    // if(chunk.hasOwnProperty('choices')) {
    //     for (choice in chunk.choices){
    //         let ci = choice.index;
    //         chunk.choices[ci] = {
    //             ...chunk.choices[ci],
    //             content: chunk.choices[ci].content += choice.content 
    //         }
    //     }
    // }

    // // Merging choices
    // if(chunk.hasOwnProperty('choices')) {
    //     for (choice in chunk.choices){
    //         let ci = choice.index;
    //         chunk.choices[ci] = {
    //             ...chunk.choices[ci],
    //             content: chunk.choices[ci].content += choice.content 
    //         }
    //     }
    // }


// function mergeStreamArray(chunk, response) {

//     // get the choice array from the chunk.
//     let { choices, ...base } = chunk;

//     // merge the chunk with the response
//     response = { ...response, ...base }

//     // set the choices array if it hasn't been set
//     if (!Array.isArray(response.choices)) { response.choices = [] }

//     // for each choice in the chunk 
//     for (const choice of choices) {

//         // get the index
//         let ci = choice.index
//         // pull out the delta
//         let { delta, ...restOfChoice } = choice
//         // merge the choice
//         response.choices[ci] = { ...response.choices[ci], ...restOfChoice }
        
        
//         // for the delta merge the role
//         if(delta.role){
//             response.choices[ci].role = delta.role
//         }
//         if(delta.content){
//             response.choices[ci].content = (response.choices[ci].content === undefined) 
//                 ? delta.content
//                 : response.choices[ci].content + delta.content
//         }
        
//         if(delta.tool_calls){

//             // set the tool_calls array
//             response.choices[ci].tool_calls = response.choices[ci].tool_calls || []
            
//             for (const tool of delta.tool_calls){
//                 // get the index 
//                 let ti = tool.index

//                 // pull out the function 
//                 let {function:func, ...restOfTool} = tool

//                 // merge the tool_call
//                 response.choices[ci].tool_calls[ti] = { ...response.choices[ci].tool_calls[ti], ...restOfTool }
                
//                 let argument = (response.choices[ci].tool_calls?.[ti]?.function?.arguments || '') + func.arguments

//                 response.choices[ci].tool_calls[ti].function = {...response.choices[ci].tool_calls[ti].function,...func}
//                 response.choices[ci].tool_calls[ti].function.arguments = argument
//             }

//         }


//     }

//     // Returning the final object
//     return response;
// }

function mergeStreamArray(chunk, response) {
    const { choices, ...base } = chunk;

    response = { ...response, ...base };
    response.choices = response.choices || [];

    choices.forEach(choice => {
        const { index: ci, delta, ...restOfChoice } = choice;

        response.choices[ci] = { ...response.choices[ci], ...restOfChoice };

        if (delta.role) response.choices[ci].role = delta.role;
        if (delta.content) response.choices[ci].content = response.choices[ci].content ? response.choices[ci].content + delta.content : delta.content;
        
        if (delta.tool_calls) {
            response.choices[ci].tool_calls = response.choices[ci].tool_calls || [];

            delta.tool_calls.forEach(tool => {
                const { index: ti, function: func, ...restOfTool } = tool;

                response.choices[ci].tool_calls[ti] = { ...response.choices[ci].tool_calls[ti], ...restOfTool };
                
                const existingArguments = response.choices[ci].tool_calls[ti].function?.arguments || '';
                response.choices[ci].tool_calls[ti].function = { ...response.choices[ci].tool_calls[ti].function, ...func, arguments: existingArguments + func.arguments };
            });
        }
    });

    return response;
}

let merged = {}
for (const chunk of streamArray){
    merged = mergeStreamArray(chunk , merged);
}
console.log(JSON.stringify(merged, null, 2));
