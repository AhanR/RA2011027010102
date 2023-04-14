import express, { NextFunction, Router } from 'express';
import http from 'http';
import apiGet from './src/api-get';

const app = express();
const PORT = 8080
export let registration = null;

// on app startup fetch token through /register
// get token that can expire
// before any request to localhost:300 check validity of key
// create subroutine for the function call

let trainDetails = [];
let last_updated = new Date();

app.get("/", async (req, res, next) => {
    trainDetails = await apiGet();
    if(trainDetails == null) {
        res.send("Error");
    } else {
        res.send(trainDetails);
    }
})

export function setUpdateDate(date) {
    last_updated = date;
}

http.createServer(app).listen(PORT, async () => {
    console.log("Server starting...");
    // register token for company
    const rep = await fetch("http://localhost:3000", {
        method : "POST",
        body : JSON.stringify({
            "companyName" : "Ahan test"
        })
    })
    registration = await rep.json();
    
})