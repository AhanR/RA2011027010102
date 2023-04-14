import express, { NextFunction, Router } from 'express';
import http from 'http';

const app = express();
const PORT = 8080

app.get("/", (req, res, next) => {
    res.send("Hello");
})

http.createServer(app).listen(PORT, () => console.log("Server starting..."))