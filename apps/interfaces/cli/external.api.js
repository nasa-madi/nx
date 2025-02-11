/*******************************
 * call-tools.js
 *******************************/
// To be called on the response after fully captured
// returns either the response object or a stream object
export async function callTools(tool_calls) {

    // const responseMessage = response?.choices[0]?.message;
  
    // update the messages to include the assistants reply
    let newMessages = []
  
    if (tool_calls) {
        // console.log('in tool calls', tool_calls)
        // for each toolCall, run the tool
        for (const toolCall of tool_calls) {
            const functionName = toolCall.function.name;
            const functionToCall = toolToFunc[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs);
  
            // update the messages to include the tool calls
            newMessages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: functionResponse,
            });
        }
    }
    return newMessages
  }
  /***********************************/


 


/*******************************
 *  tools.js
 *******************************/
export function getCurrentWeather({ location, unit = "fahrenheit" }) {
    if (location.toLowerCase().includes("tokyo")) {
        return JSON.stringify({ location: "Tokyo", temperature: "10", unit: "celsius" });
    } else if (location.toLowerCase().includes("san francisco")) {
        return JSON.stringify({ location: "San Francisco", temperature: "72", unit: "fahrenheit" });
    } else if (location.toLowerCase().includes("paris")) {
        return JSON.stringify({ location: "Paris", temperature: "22", unit: "fahrenheit" });
    } else {
        return JSON.stringify({ location, temperature: "unknown" });
    }
  }
  
  export const getCurrentWeatherDesc = {
    type: "function",
    function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The city and state, e.g. San Francisco, CA",
                },
                unit: { type: "string", enum: ["celsius", "fahrenheit"] },
            },
            required: ["location"],
        },
    },
  };
  
  export const availableTools = {
    get_current_weather:getCurrentWeatherDesc
  }
  export const toolToFunc = {
    get_current_weather:getCurrentWeather
  }
  /***********************************/
  
  
  
  