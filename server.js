const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const app = express();
const HTTP_PORT = 8080

app.get("/",(req,res)=>{
    res.send({message:"API Listening"});
});

app.use(cors());

app.use(express.json());

app.listen(HTTP_PORT,()=>{
    console.log(`Server is listening on port ${HTTP_PORT}`)
});