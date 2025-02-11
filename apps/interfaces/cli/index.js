import colors from "colors";
import prompt from 'prompt-async';
import fs from 'fs';
import { processConversation} from './api.js'
import OpenAI from "openai";
import * as dotenv from 'dotenv';
// import { streaming, nonStreaming } from './stream.js'
import { authenticate, checkFileCredentials } from "./auth.js";
import padEnd from 'lodash/padEnd.js'

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})


const STREAM = true //process.env.USE_STREAM === 'true'


/*******************************
 *  login.js
 *******************************/
const login = async () => {
    let authResponse
    prompt.start();

    prompt.message = "";
    prompt.delimiter = colors.cyan(": ");

    let result = await prompt.get(
        {
            properties: {
                email: {
                    description: colors.cyan('Please enter your email address or username'),
                    required: true
                },
                password: {
                    description: colors.cyan('Please enter password'),
                    hidden: true,
                    required: true
                }
            }
        })

    // console.log('result',result)
    result = {
        email: "test@example.com",
        password: "magicalpassword"
    }

    return authenticate(result.email, result.password, 'local')
        .then((r) => {
            prompt.stop();
            return r
        })
    // TODO add a failure option to retry
}



// // /***
// //  * 
// //  */
// export const processConversation = async (conversation, tools, tool) => {
//     // writeFunc = function (n) { process.stdout.write(n) }
  
//     const response = await makeRequest({
//         model: 'gpt-4-1106-preview',
//         messages: conversation,
//         tools,
//         tool_choice: tool,
//         stream:STREAM,
//     });
  
//     // deal with the merging if streamed
//     let mergeObject = {}
//     for await (const chunk of response) {
//         mergeObject = handleDeltas(chunk, mergeObject, deltaPaths, concatenatedPaths)
//     }

//     // append the final bits
//     conversation.push(mergeObject)
  
//     console.log('')
//     return conversation
//   }






/*******************************
 * index.js
 *******************************/

console.log("\n\n****************************")
console.log("   Welcome to the MADI CLI")
console.log("****************************")


prompt.message = colors.cyan(padEnd('User:',8));
prompt.delimiter = colors.cyan("");
let conversation = [];

const getResponse = async () => {
    // if not authenticated
    let credentials = checkFileCredentials('api.credentials.json');
    let user
    let accessToken
    if(!credentials && process.env.REQUIRE_AUTH === 'true'){
        //then login
        let authResponse = await login();
        user = authResponse.user
        accessToken = authResponse.accessToken
    }
    prompt.get({
        properties: {
            message: {
                description: " "//" \u200b"
            }
        }
    },
        async (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            // get authenticated toolset
            let tools = ['get_current_weather']//credentials.user.plugins //authenticated + generic tools
            let tool = 'auto'//'get_current_weather'
            // console.log(tools, tool)

            let { command, input } = checkCommand(result.message)
            // console.log('COMMANDS: ', command, input)
            switch (command) {

                case 'help':
                    console.log(getHelpText())
                    break;
                default:
                    // Adding user's response to conversation
                    // input = "What's the weather like in San Francisco, Tokyo, and Paris?"

                    conversation.push({ role: 'user', content: input });

                    let output = padEnd('AI:',8);
                    process.stdout.write(colors.magenta(output));
                    
                    conversation = await processConversation(conversation, tools, tool, (text)=>process.stdout.write(text))
                    process.stdout.write('\n');
            





                /*******************************
                 * DIRECT
                 *******************************/


                // conversation.push({role:"assistant", content:message})
                // console.log('') // closes out the line so that process.stdout doesn't get deleted.

                // console.log("aiResponse", aiResponse)
                // Adding AI's response to conversation
                // conversation.push(aiResponse);

                // Print the response of the AI


            }

            // Continue with next response
            getResponse();

        });
}




















const checkCommand = (message) => {
    let slashIndex = message.indexOf('/')
    let spaceIndex = message.indexOf(' ')
    // if it's a command
    if (slashIndex === 0) {
        // Extract the command if a space follows the command prefix
        if (spaceIndex > 0) {
            // slice slash, get command
            let command = message.slice(1, spaceIndex)
            let input = message.slice(spaceIndex + 1).trim()
            // console.log('command: ', command)
            // console.log('input: ', input)
            return { command, input }
        } else {
            // If there's no space, the whole message is the command
            let command = message.slice(1)
            return { command, input: '' }
        }
    } else {
        return { command: null, input: message.trim() }
    }
}

const getHelpText = () => {
    return `
        /help - show functions available
        /weather - check the weather
        /bob - change the assistant to bob
    `;
}

getResponse();


