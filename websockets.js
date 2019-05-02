const ws = require('ws');

var clients = [];

exports.socketConnection = function(server) {
  const wss = new ws.Server({ server });
  wss.on('connection', (socket, req) => {
    handleClient(socket, req)
    socket.on('message', message => {handleMessage(socket, JSON.parse(message))} );
  });
}

function handleClient(socket, req) {
  let ip = req.connection.remoteAddress.slice(7)
  if(clients.length < 2) acceptClient(socket, ip)
  else rejectClient(socket, ip)
}

function acceptClient(socket, ip){
  clients.push( {"socket" : socket, "ip" : ip} )
  console.log(ip + " connected successfully");
  socket.send(JSON.stringify({"type": "success"}));
  if(clients.length === 2) startGame()
}

function rejectClient(socket, ip){
  console.log(ip + " rejected");
  socket.send(JSON.stringify({"type" : "fail"}));
}

function startGame(){
  clients[0]["socket"].send(JSON.stringify({"type" : "startGame", "pos" : "left"}))
  clients[1]["socket"].send(JSON.stringify({"type" : "startGame", "pos" : "right"}))
}

function handleMessage(socket, message){
  switch (message.type) {
    case "mouseLocation":
      sendToOtherPeer(message.value, socket);
      break;
    case "ballPos":
      updateBallPos(message, socket)
    default:

  }
}

function sendToOtherPeer(value, socket){
  let obj = JSON.stringify({"type" : "position", "value" : value})
  if(clients[0]["socket"] === socket){
    clients[1]["socket"].send(obj)
  }
  else{
    clients[0]["socket"].send(obj)
  }
}

function updateBallPos(message, socket){
  clients[1]["socket"].send(JSON.stringify(message))
}
