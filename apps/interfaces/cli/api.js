import axios from 'axios';
import * as dotenv from 'dotenv';
import OpenAI from "openai";
import { availableTools, callTools } from './external.api.js';
import { handleDeltas } from './delta.js'
import pkg from 'lodash';
const { set, get } = pkg;


dotenv.config();
const streamPrintPath = 'choices[0].delta.content'
const nonstreamPrintPath = 'choices[0].content'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const getToolDescriptions = async (tools)=>{
  if(process.env.USE_LOCAL){
    return availableTools
  }else{
    throw new Error("Can't use external tool call yet")
  }

}

export const makeRequest = async (options)=>{
  if(process.env.USE_LOCAL){
    return openai.chat.completions.create(options);
  }else{
    let { accessToken, messages, tools, tool_choice } = options
    const chatResponse = await axios({
      method: 'post',
      url: `${process.env.API_ENDPOINT}/chats`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        messages,
        tools: tools.length ? tools : undefined,
        tool_choice: tool_choice || 'auto',
      }
    });
    return chatResponse.data.choices[0].message;
  }
}


export const processConversation = async (conversation, tools, tool, writeFunc) => {

  let options = {
    model: 'gpt-4-1106-preview',
    stream: true,
    messages:conversation, 
    tools, 
    tool_choice: tool
  }
  // if its use local, then you need to run call Tools
  options.tools = Object.values(availableTools)
  let response = await makeRequest(options)
  let mergeObject = {}
  if(options.stream){
    for await (const chunk of response) {
      mergeObject = handleDeltas(chunk, mergeObject)
      if(get(chunk,streamPrintPath)){
        writeFunc(get(chunk,streamPrintPath))
      }
    }
    conversation.push(mergeObject.choices[0])
  }else{
    mergeObject = response
    writeFunc(get(mergeObject,nonstreamPrintPath)||'')
  }

  if(process.env.USE_LOCAL){
    let functionResults = await callTools(mergeObject.choices[0].tool_calls);
    if (functionResults.length) {
      conversation.push(...functionResults)
      conversation = await processConversation(conversation, tools, tool, writeFunc)
    }
  }
  return conversation
};



