import express, { NextFunction, Router } from 'express';
import http from 'http';
import apiGet from './src/api-get';
import axios from 'axios';

interface Registration {
    companyName : String,
    clientID : String,
    clientSecret : String
}

const app = express();
const PORT = 8080
export let registration : Registration | unknown;
// export let registration = {
//     "companyName": "",
//     "clientID": "",
//     "clientSecret": ""
// };

// on app startup fetch token through /register
// get token that can expire
// before any request to localhost:300 check validity of key
// create subroutine for the function call


let trainDetails : any = [];
let last_updated = new Date();

app.get("/", async (req, res, next) => {
    trainDetails = await apiGet();
    // if the last update was within the last minute, return the array as is
    // if(last_updated.setMinutes(last_updated.getMinutes() + 1) < new Date()) {
    //      return trainDetails;
    // }
    if(trainDetails == null) {
        res.send("Error");
    } else {
        res.send(trainDetails);
    }
})

export function setUpdateDate(date : Date) {
    last_updated = date;
}

http.createServer(app).listen(PORT, async () => {
    console.log("Server starting...");
    // register token for company
    const rep = await axios.post("http://localhost:3000/register", {
        "companyName" : "Ahan test"
    })
    registration = await rep.data;
    
})