import colors from "colors";
import prompt from 'prompt';
// import {talkToAI, authenticate} from './api.js'


// Authenticate
const login = async ()=>{
    prompt.start();
    console.log("\n\n****************************")
    console.log("   Welcome to the MADI CLI")
    console.log("****************************")
    
    prompt.message = "";
    prompt.delimiter = colors.cyan(": ");
    
    let result = await prompt.get(
        {
            properties:{
                email: {
                    description: colors.cyan('Please enter your email address or username'),
                    required: true
                },
                password: {
                    description: colors.cyan('Please enter password'),
                    hidden:true,
                    required: true
                }
            }
        }, 
        function (err, result) {
            if (err) { return onErr(err); }
            console.log('result',result)
            // authenticate(result.email, result.password).then((result)=>{
            //     let { accessToken } = result;
        
            //     // fs.writeFile(accessToken)
            //     // Call talkToAI after authentication is successful
            // });
            prompt.stop();
        }
    );
}
login()


// function onErr(err) {
//     console.error(err);
//     return 1;
// }



// prompt.message = colors.cyan("User:");
// prompt.delimiter = colors.cyan("");
// let conversation = [];

// const getResponse = () => {  
//   prompt.get({
//         properties: {
//             message: {
//                 description: "\u200b"
//             }
//         }
//     }, 
//     async (err, result) => {
//         if (err) {
//             console.error(err);
//             return;
//         }

//         // get authenticated toolset
//         let tools = (await authenticate()).tools //authenticated + generic tools
//         let tool = 'auto'//'get_current_weather'
//         // console.log(tools, tool)

//         let { command, input } = checkCommand(result.message)
//         // console.log('COMMANDS: ', command, input)
//         switch(command){

//             case 'help':
//                 console.log(getHelpText())
//                 break;
//             default:
//                 // Adding user's response to conversation
//                 conversation.push({role:'user', content: input});

//                 // Sending full conversation to AI
//                 let aiResponse = await talkToAI(conversation, tools, tool);
//                 console.log("aiResponse", aiResponse)
//                 // Adding AI's response to conversation
//                 conversation.push(aiResponse);
                
//                 // Print the response of the AI
//                 let response = 'AI:   ' + aiResponse.content 
//                 console.log(colors.magenta(response));

//         }
        
//         // Continue with next response
//         getResponse();

//     });
// }

// const checkCommand = (message) => {
//     let slashIndex = message.indexOf('/')
//     let spaceIndex = message.indexOf(' ')
//     // if it's a command
//     if (slashIndex === 0) {
//         // Extract the command if a space follows the command prefix
//         if (spaceIndex > 0) {
//             // slice slash, get command
//             let command = message.slice(1, spaceIndex)
//             let input = message.slice(spaceIndex + 1).trim()
//             // console.log('command: ', command)
//             // console.log('input: ', input)
//             return { command, input }
//         } else {
//             // If there's no space, the whole message is the command
//             let command = message.slice(1)
//             return { command, input: '' } 
//         }
//     } else {
//         return { command: null, input: message.trim() }
//     }
// }

// const getHelpText = ()=>{
//     return `
//         /help - show functions available
//         /weather - check the weather
//         /bob - change the assistant to bob
//     `;
// }

// getResponse();
