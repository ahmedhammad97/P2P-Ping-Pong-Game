const ws = require('ws');

var clients = [];
var conn = null;
var peerSide = null;
var IamReady, peerReady = false;

exports.socketConnection = function(server, otherPeer) {
  const wss = new ws.Server({ server });
  conn = otherPeer.conn;
  peerSide = otherPeer.side;
  wss.on('connection', (socket, req) => {
    handleClient(socket, req)
    socket.on('message', message => {messageToPeer(message)} );
  });
  conn.on('data', data => {messageToClient(data)} );
}

function handleClient(socket, req) {
  let ip = req.connection.remoteAddress.slice(7)
  if(clients.length < 1) acceptClient(socket, ip)
  else rejectClient(socket, ip)
}

function acceptClient(socket, ip){
  clients.push( {"socket" : socket, "ip" : ip} )
  IamReady = true;
  conn.write(JSON.stringify({"type" : "ready"}))
  socket.send(JSON.stringify({"type": "success"}));
  if(IamReady && peerReady) startGame()
}

function rejectClient(socket, ip){
  console.log(ip + " rejected");
  socket.send(JSON.stringify({"type" : "fail"}));
}

function startGame(){
  console.log("Game started");
  clients[0]["socket"].send(JSON.stringify({"type" : "startGame", "pos" : peerSide}))
}

function messageToPeer(message){
  conn.write(message)
}

function messageToClient(message){
  if(JSON.parse(message).type === "ready"){
    peerReady = true;
    if(IamReady && peerReady) startGame()
  }
  else clients[0]["socket"].send(message.toString())
}
