import { registration, setUpdateDate } from "../main";
import axios from 'axios'

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
    const rep = await axios.get("localhost:3000"+route, {
        headers : {
            "authorization" : authentication["token_type"] + " " + authentication["access_token"]
        }
    });
    setUpdateDate(new Date());
    return await rep.data;
}

export async function doAuth() {
    // if the company has not been registerd, we cannot authorize them
    if(registration == null) {
        return null;
    }
    // fetch and store auth details
    const rep = await axios.post("http://localhost:3000/auth", registration);
    const authentication = await rep.data;
    console.log(authentication);
}