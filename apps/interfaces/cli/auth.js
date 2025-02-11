import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();


/*******************************
 *  auth.js
 *******************************/
export const checkFileCredentials = (filename = 'credentials.json') => {
    const credentialPath = path.resolve(filename);
    if (fs.existsSync(credentialPath)) {
        return JSON.parse(fs.readFileSync(credentialPath, 'utf-8'));
    }else{
        return false
    }
}


export const authenticate = async (email, password, strategy="local") => {
    return axios({
        method: 'post',
        url: `${process.env.AUTH_ENDPOINT}`,
        data: {
            email,
            password,
            strategy
        }
    }).then(result=>{
        return {user:result.data.user, accessToken:  result.data.accessToken}
    })
}
/***********************************/

