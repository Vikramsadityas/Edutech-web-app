import ConnectDB from "./db/index.js"
import dotenv from 'dotenv'
import express  from "express"
import {app} from "./app.js"
dotenv.config({
    path: './.env'
})
ConnectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("ERROR:",err);
        throw err;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server connected at the port:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Mongo DB connection failed',err);
    
})