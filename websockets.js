const ws = require('ws');

var clients = [];

exports.socketConnection = function(server) {
  const wss = new ws.Server({ server });

  wss.on('connection', (socket, req) => {
    handleClient(socket, req)
    socket.on('message', message => { handleMessage(socket, message) } );
  });
}

function handleClient(socket, req) {
  let ip = req.connection.remoteAddress;
  if(clients.length < 2) {
    clients.push( {"socket" : socket, "ip" : ip} )
    console.log(ip + " connected successfully");
    socket.send("success")
  }
  else{
    console.log(ip + " rejected")
    socket.send("fail")
  }
}

function handleMessage(socket, message){
  console.log(message);
  // TODO: emit it to other client
}
