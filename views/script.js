const transimissionRate = 50;
var PositionY = 0;

socket.onmessage = message => {
  handleMessage(JSON.parse(message.data))
}

function handleMessage(message){
  var msgBar = document.querySelector("#message")
  switch (message.type) {

    case "success":
      msgBar.innerHTML = "Waiting for other peer to join..."
      break;

    case "fail":
      msgBar.innerHTML = "Game capacity is full, try again later."
      break;

    case "startGame":
      msgBar.innerHTML = ""
      trackMouse()
      beginTransimission()
      break;

    case "position":
      // TODO: Update ghost position using message.value
      break;
    default:

  }
}

function trackMouse(){
  document.addEventListener("mousemove", event => {
    // TODO: Move game object
    PositionY = event.clientY
  })
}

function beginTransimission(){
  setInterval(() => {
    socket.send(JSON.stringify({"type" : "mouseLocation", "value" : PositionY}))
  } ,transimissionRate)
}
