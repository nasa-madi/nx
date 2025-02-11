

// import {chatWithAI, makeRequest} from './api.js'



// /*******************************
//  * STREAMING
//  *******************************/
// export const streaming = async (conversation, tools, tool, writeFunc, writeNewLine) => {
//   writeNewLine = writeNewLine || function () { process.stdout.write('\n') }
//   writeFunc = writeFunc || function (n) { process.stdout.write(n) }


//   const response = await makeRequest({
//       model: 'gpt-4-1106-preview',
//       messages: conversation,
//       tools,
//       tool_choice: tool,
//       stream: true
//   });

//   let mergeObject = {}
//   for await (const chunk of response) {
//       mergeObject = handleDeltas(chunk, mergeObject, deltaPaths, concatenatedPaths)
//   }

//   conversation.push(mergeObject.choices[0])

//   if(process.env.USE_LOCAL){
//     let functionResults = await callTools(mergeObject.choices[0].tool_calls);
//     if (functionResults.length) {
//         conversation.push(...functionResults)
//         conversation = await streaming(conversation)
//     }
//   }
//   console.log('')
//   return conversation


// }
// /***********************************/









// /*******************************
// * NONSTREAMING
// *******************************/
// export const nonStreaming = async (conversation, tools, tool, writeFunc, writeNewLine) => {
//   writeFunc = writeFunc || function (n) { process.stdout.write(n) }

//   const response = await chatWithAI({
//       model: 'gpt-4-1106-preview',
//       messages: conversation,
//       tools,
//       tool_choice: tool,
//       stream: false
//   });

//   const responseMessage = response.choices[0].message;

//   const toolCalls = responseMessage.tool_calls;
//   if (toolCalls) {
//       conversation.push(responseMessage)
//       let functionResults = await callTools(toolCalls);
//       if (functionResults.length) {
//           conversation.push(...functionResults)
//           conversation = nonStreaming(conversation)
//       }
//   } else {
//       writeFunc(responseMessage.content)
//   }
//   return conversation

// }
// /***********************************/




