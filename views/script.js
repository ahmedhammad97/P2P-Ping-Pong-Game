const transimissionRate = 50;
var PositionY = 0;
var canvas = document.querySelector("#gameTable");
var msgBar = document.querySelector("#message");
var myPaddle, otherPaddle = null;
var transimission = null;

socket.onmessage = message => {
  handleMessage(JSON.parse(message.data))
}

socket.onclose = () => {
    msgBar.innerHTML = "Connection lost!"
    clearInterval(transimission)
};

function handleMessage(message){
  switch (message.type) {

    case "success":
      msgBar.innerHTML = "Waiting for other peer to join..."
      break;

    case "fail":
      msgBar.innerHTML = "Game capacity is full, try again later."
      break;

    case "startGame":
      msgBar.innerHTML = ""
      prepareGameView(message)
      trackMouse()
      beginTransimission()
      break;

    case "position":
      // TODO: Update ghost position using message.value
      break;
    default:

  }
}

function prepareGameView(message){
  drawTableLines()

  leftPaddle = {
    "paddle" : canvas.getContext("2d"),
    "xPos" : 10,
    "yPos" : 200
  }
  rightPaddle = {
    "paddle" : canvas.getContext("2d"),
    "xPos" : 785,
    "yPos" : 200
  }

  drawPaddles(leftPaddle, rightPaddle)
  if (message.pos === "right"){myPaddle = rightPaddle; otherPaddle = leftPaddle;}
  else {myPaddle = leftPaddle; otherPaddle = rightPaddle;}

}

function trackMouse(){
  canvas.addEventListener("mousemove", event => {
    PositionY = event.clientY - 80
    // Move game object
    myPaddle.paddle.clearRect(myPaddle.xPos, myPaddle.yPos, 5, 100)
    myPaddle.paddle.fillRect(myPaddle.xPos, PositionY, 5, 100)
    myPaddle.yPos = PositionY
  })
}

function beginTransimission(){
  transimission = setInterval(() => {
    socket.send(JSON.stringify({"type" : "mouseLocation", "value" : PositionY}))
  } ,transimissionRate)
}

function drawTableLines(){
  let line = canvas.getContext("2d")
  line.fillStyle = "#FFFFFF";
  line.fillRect(398, 0, 4, 500);
}

function drawPaddles(leftPaddle, rightPaddle){
  leftPaddle.paddle.fillStyle = "FFFFFF"
  leftPaddle.paddle.fillRect(10, 200, 5, 100)

  rightPaddle.paddle.fillStyle = "FFFFFF"
  rightPaddle.paddle.fillRect(785, 200, 5, 100)
}
