const express = require('express');
const swarm = require('discovery-swarm')
const webSocket = require(__dirname + '/websockets');
const ip = require('ip');
const app = express();
const serverPort = 5000 + Math.floor((Math.random() * 500) + 1);
const swPort = 6000 + Math.floor((Math.random() * 500) + 1);
const sw = swarm();
sw.listen(swPort);
sw.join('PingPong');

// For static front-end files
app.use(express.static('views'));

app.set('view engine', 'ejs');

const server = app.listen(serverPort, () => {console.log("Game available on: " + ip.address() + ":" + serverPort) });

// Main Endpoint
app.get('/', (req, res) => {res.render('index', {"ip" : ip.address(), "port" : serverPort})});

// Discovered Peer
var timer = null;
sw.on('connection', function(conn, info) {
  if(!conn.server){
    timer = setTimeout(() => {
      webSocket.socketConnection(server, {"conn" : conn, "side" : "right"})
    }, 1000)
  }
  else{
    // Socket Api
    webSocket.socketConnection(server, {"conn" : conn, "side" : "left"});
    clearTimeout(timer)
  }
})
