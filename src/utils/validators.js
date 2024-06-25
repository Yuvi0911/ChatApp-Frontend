import {isValidUsername} from "6pp";

//username ko validate kr skte h hum is function ki help se.
export const usernameValidator = (username) => {
    //isValidUsername iske ander code h jo ki username ko parameter me le kr ushe check krega ki uska format shi ya nhi. Yadi format me kuch glti hogi jaise ki space ya aur kuch toh error return ho jaiye ga 
    if(!isValidUsername(username))
    {
        return {
            isValid: false,
            errorMessage: "Username is Invalid"
        };
    }
}