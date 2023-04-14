import express, { NextFunction, Router } from 'express';
import http from 'http';
import apiGet, { doAuth } from './src/api-get';
import axios from 'axios';

interface Registration {
    companyName : String,
    clientID : String,
    clientSecret : String
}

interface Train {
    trainName: String,
    trainNumber: String,
    departureTime: {
        Hours: number,
        Minutes: number,
        Seconds: number
    },
    seatsAvailable: {
        sleeper: number,
        AC: number
    },
    price: {
        sleeper: number,
        AC: number
    },
    delayedBy: number
}

const app = express();
const PORT = 8080;
export let registration : Registration | unknown;

// on app startup fetch token through /register
// get token that can expire
// before any request to localhost:300 check validity of key
// create subroutine for the function call


let trainDetails : [] = [];
let last_updated = new Date(0);

export function setUpdateDate(date : Date) {
    last_updated = date;
}

app.get("/", async (req, res, next) => {
    // if the last update was within the last minute, return the array as is
    const timeNow = new Date();
    if(last_updated.getTime() + 60000 > timeNow.getTime()) {
        res.send(trainDetails);
        return;
    }

    // if details are old, then return new details
    trainDetails = await apiGet();

    // filter the trains with less than 30 min to departure
    trainDetails.filter((a:Train)=>{
        if(a.departureTime.Hours < 1 && a.departureTime.Minutes < 30) return false;
        return true;
    })

    // sort the trains
    trainDetails.sort((a : Train,b : Train) => {
        // we need to consider the time, the seats availabe, the price
        // first consideration is the time
        // second considertation is the seats

        // consider time
        const timeA = a.departureTime.Hours*60*60 + a.departureTime.Minutes*60 + a.departureTime.Seconds;
        const timeB = b.departureTime.Hours*60*60 + b.departureTime.Minutes*60 + b.departureTime.Seconds;
        if(timeA > timeB) return 1;
        else if (timeA < timeB) return -1;

        // consider the seats
        const seatsA = a.seatsAvailable.AC + a.seatsAvailable.sleeper;
        const seatsB = b.seatsAvailable.AC + b.seatsAvailable.sleeper;
        if(seatsA < seatsB) return 1;
        else if (seatsA > seatsB) return -1;

        // consider price
        // only considering sleeper cost to make sure that the lowest cost is compared, can be adjusted later
        if(a.price.sleeper > b.price.sleeper) return 1;

        return 0;
    } )

    // return the trains
    // console.log(trainDetails);
    if(trainDetails == null) {
        res.send("Error");
    } else {
        res.send(trainDetails);
    }
})

http.createServer(app).listen(PORT, async () => {
    console.log("Server starting...");
    // register token for company
    const rep = await axios.post("http://localhost:3000/register", {
        "companyName" : "Ahan test"
    })
    registration = await rep.data;
    doAuth();
    console.log("ready for requests")
})