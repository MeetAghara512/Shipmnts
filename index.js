const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');


dotenv.config();

const app=express();
const PORT = 8000;

//middleware  - Plugin
app.use(express.json());
app.use(express.urlencoded({extended:false}));


connectDB();

// API





app.listen(PORT,()=>{console.log(`Server Started at Port : ${PORT}`)});