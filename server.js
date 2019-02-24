var http = require('http');
//var js = require('../js');
let fs = require('fs');
const express = require("express");
const path = require("path");
//loads http module

//sets port and IP address of the server

const app = express(); // define our app using express

const port = 8000;

app.listen(port);

const publicPath = path.resolve(__dirname, ".");
app.use(express.static(publicPath));

console.log('Server running at == http://127.0.0.1:8000/');
