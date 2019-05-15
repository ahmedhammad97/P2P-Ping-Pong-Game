const express = require('express');
const dgram = require('dgram');
const net = require('net');
const ip = require('ip');
const webSocket = require(__dirname + '/websockets');
const serverPort = 6000 + Math.floor((Math.random() * 500) + 1);
const broadcastPort = 5678;
const broadcastIp = "255.255.255.255";

const app = express();
// For static front-end files
app.use(express.static('views'));
app.set('view engine', 'ejs');
const server = app.listen(serverPort, () => {console.log("Game available on: " + ip.address() + ":" + serverPort) });
// Main Endpoint
app.get('/', (req, res) => {res.render('index', {"ip" : ip.address(), "port" : serverPort})});

var serverConnected = false;
var socketServer = net.createServer(function(socket) {
  clearInterval(interval);
	socket.setEncoding("utf8");
  socket.on('data', function(data) {
    if (!serverConnected){
      webSocket.socketConnection(server, {"conn" : socket, "side" : "left"})
      serverConnected = true;
    }
  });
});
socketServer.listen(serverPort+1);


const socket = dgram.createSocket({type: 'udp4', reuseAddr: true});
socket.bind(broadcastPort);
socket.on('listening', ()=>{socket.setBroadcast(true);})
var interval = setInterval(broadcast, 1000)

var clientConnected = false;
socket.on('message', function(msg, info) {
  msg = msg.toString()
  if(clientConnected || msg == serverPort) return;

	else{
    clearInterval(interval)
    var client = new net.Socket();
    client.connect(parseInt(msg)+1, info.address, function() {
    	client.write(JSON.stringify({"ip": ip.address(), "port": serverPort}));
    });
    clientConnected = true;
		webSocket.socketConnection(server, {"conn" : client, "side" : "right"})
  }

});

function broadcast(message){
  socket.send(Buffer.from(serverPort.toString()), broadcastPort, broadcastIp);
}
