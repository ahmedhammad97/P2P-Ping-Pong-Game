const express = require('express');
const websocket = require(__dirname + '/websockets');
const ip = require('ip');

const app = express();

// For static front-end files
app.use(express.static('views'));

app.set('view engine', 'ejs');

const server = app.listen(5050, () => {console.log("Listening at port 5050") });

// Main Endpoint
app.get('/', (req, res) => {res.render('index', {"ip" : ip.address()})});

// Socket Api
websocket.socketConnection(server);
