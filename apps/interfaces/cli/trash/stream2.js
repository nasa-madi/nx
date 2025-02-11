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



function mergeObjectFields(chunk, concatenatedFields, response) {


    
  function handleDeltas(object, parentKey = '') {
    for (let key in object) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (object[key] && typeof object[key] === 'object') {
        if ('index' in object[key] && 'delta' in object[key]) {
          mergeDelta(object[key], fullKey);
        } else {
          handleDeltas(object[key], fullKey);
        }
      }
    }
  }

  function mergeDelta(deltaObj, parentKey) {
    const {index, delta, ...restOfDelta} = deltaObj;

    const objKey = `${parentKey}.${index}`;
    setProperty(response, objKey, {...getProperty(response, objKey, {}), ...restOfDelta});

    if (delta) {
      Object.keys(delta).forEach(deltaKey => {
        if (concatenatedFields.includes(deltaKey)) {
          const oldValue = getProperty(response, `${objKey}.${deltaKey}`, '');
          setProperty(response, `${objKey}.${deltaKey}`, oldValue + delta[deltaKey]);
        } else {
            setProperty(response, `${objKey}.${deltaKey}`, delta[deltaKey]);
        }
      });
    }
  }

  handleDeltas(chunk);
  return response
}

// let chunk = // fetch chunk data;
// let response = // fetch response data;
// mergeObjectFields(chunk, fieldsToConcatenate, response);

let fieldsToConcatenate = ['content', 'arguments']; // fields to concatenate
let merged = {}
for (const chunk of streamArray){
    merged = mergeObjectFields(chunk, fieldsToConcatenate, merged);
}
console.log(JSON.stringify(merged, null, 2));
