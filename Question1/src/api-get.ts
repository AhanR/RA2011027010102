import { json } from "express";
import { registration } from "../main";

export let authentication = {
    "token_type" : "",
    "access_token" : "",
    "expires_in" : 0
};

export default async function apiGet(route="/trains") {
    // check if the authentication is still valid or not
    // if not valid, request new auth
    // else make the request
    console.log(new Date(authentication["expires_in"]*1000), new Date())
    if(new Date(authentication["expires_in"]*1000) < new Date()) {
        // the date is older than current date
        // we need new token
        doAuth();
    }
    // get the required data from the server
    const rep = await fetch("localhost:3000"+route, {
        method: "get",
        headers : {
            "authorization" : authentication["token_type"] + " " + authentication["access_token"]
        }
    });
    return await rep.json();
}

export async function doAuth() {
    // if the company has not been registerd, we cannot authorize them
    if(registration == null) {
        return null;
    }
    // fetch and store auth details
    const rep = await fetch("http://localhost:3000/auth", {
        method : "post",
        body : JSON.stringify(registration)
    })
    authentication = await rep.json();
}