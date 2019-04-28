const ws = require('ws');

var clients = [];

exports.socketConnection = function(server) {
  const wss = new ws.Server({ server });
  wss.on('connection', (socket, req) => {
    handleClient(socket, req)
    socket.on('message', message => {handleMessage(socket, message)} );
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
  socket.send("success");
  if(clients.length === 2) startGame()
}

function rejectClient(socket, ip){
  console.log(ip + " rejected");
  socket.send("fail");
}

function startGame(){
  clients[0]["socket"].send("startGame")
  clients[1]["socket"].send("startGame")
}

function handleMessage(socket, message){
  console.log(message);
  // TODO: emit it to other client
}
