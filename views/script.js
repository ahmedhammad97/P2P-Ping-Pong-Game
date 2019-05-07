const transimissionRate = 250;
const ballUpdateRate = 50;
const ballTransRate = 2000;
var PositionY = 200;
var canvas = document.querySelector("#gameTable");
var msgBar = document.querySelector("#message");
var myPaddle, otherPaddle = null;
var ball = null;
var transimission, ballTrans = null;
var paddleCollide = false;

socket.onmessage = message => {
  //console.log(message.data);
  try {handleMessage(JSON.parse(message.data)) }
  catch (e) {console.log(message, e)}
}

socket.onclose = () => {
  msgBar.innerHTML = "Connection lost!"
  clearInterval(transimission)
};

drawTableLines()

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
      if (message.pos === "left") transimitBallPos()
      break;

    case "position":
      updatePaddle(otherPaddle, otherPaddle.xPos, message.value)
      break;

    case "ballPos":
      updateBallPos(message.obj)
      break;
    default:

  }
}

function prepareGameView(message){
  leftPaddle = {
    "side" : "left",
    "paddle" : canvas.getContext("2d"),
    "xPos" : 10,
    "yPos" : 200
  }
  rightPaddle = {
    "side" : "right",
    "paddle" : canvas.getContext("2d"),
    "xPos" : 785,
    "yPos" : 200
  }

  drawPaddles(leftPaddle, rightPaddle)

  if (message.pos === "right"){myPaddle = rightPaddle; otherPaddle = leftPaddle;}
  else {myPaddle = leftPaddle; otherPaddle = rightPaddle;}

  ball = {
    "shape" : canvas.getContext("2d"),
    "xPos" : 397,
    "yPos" : 247,
    "xVel" : 5,
    "yVel" : 5
  }

  setInterval(ballUpdate, ballUpdateRate)
}

function trackMouse(){
  canvas.addEventListener("mousemove", event => {
    PositionY = event.clientY - canvas.offsetTop - 50;
    // Move game object
    updatePaddle(myPaddle, myPaddle.xPos, PositionY)
  })
}

function beginTransimission(){
  transimission = setInterval(() => {
    socket.send(JSON.stringify({"type" : "position", "value" : PositionY}))
  } ,transimissionRate)
}

function transimitBallPos(){
  ballTrans = setInterval(() => {
    let obj = {"xPos" : ball.xPos, "yPos" : ball.yPos, "xVel" : ball.xVel, "yVel" : ball.yVel}
    socket.send(JSON.stringify({"type": "ballPos", "obj" : obj}))
  }, ballTransRate)
}

function drawTableLines(){
  let line = canvas.getContext("2d")
  line.fillStyle = "#FFFFFF";
  line.fillRect(398, 0, 4, 500);
}

function drawPaddles(leftPaddle, rightPaddle){
  leftPaddle.paddle.fillStyle = "#FFFFFF"
  leftPaddle.paddle.fillRect(10, 200, 5, 100)

  rightPaddle.paddle.fillStyle = "#FFFFFF"
  rightPaddle.paddle.fillRect(785, 200, 5, 100)
}

function updatePaddle(paddle, x, y){
  paddle.paddle.clearRect(paddle.xPos, paddle.yPos, 5, 100)
  paddle.paddle.fillRect(x, y, 5, 100)
  paddle.xPos = x
  paddle.yPos = y
}

function updateBallPos(pos){
  clearBall()
  ball.xPos = pos.xPos;
  ball.yPos = pos.yPos;
  ball.xVel = pos.xVel;
  ball.yVel = pos.yVel;
  renderBall()
}

function ballUpdate(){
  clearBall()

  ball.xPos += ball.xVel;
  ball.yPos += ball.yVel;

  if(collideTop() || collideBottom()){ball.yVel = -ball.yVel}
  if(collidePaddles()){ball.xVel = -ball.xVel}
  if(collideLeft()){msgBar.innerHTML = "Right player scored a goal!"; ball.xVel = -ball.xVel}
  if(collideRight()){msgBar.innerHTML = "Left player scored a goal!"; ball.xVel = -ball.xVel}
  if(nearCenter()){drawTableLines()}

  renderBall()
}

// Sorry for the following mess :/
// I'll clean it when we're done :@
function collideTop(){return ball.yPos <= 0}
function collideBottom(){return ball.yPos + 6 >= 500}
function collideLeft(){return ball.xPos <= 0}
function collideRight(){return ball.xPos + 6 >= 800}
function collidePaddles(){
  if(paddleCollide){return false;}
  let myPaddleTop = myPaddle.yPos
  let myPaddleBottom = myPaddleTop + 100
  let otherTop = otherPaddle.yPos
  let otherBottom = otherTop + 100
  if(myPaddle.side === "left"){
    if(ball.xVel < 0 && ball.xPos <= 20 && ball.yPos >= myPaddleTop && ball.yPos <= myPaddleBottom){
      setPaddleCollide();
      return true;
    }
    else if(ball.xVel > 0 && ball.xPos + 26 >= 800 && ball.yPos >= otherTop && ball.yPos <= otherBottom){
      setPaddleCollide();
      return true;
    }
  }
  else{
    if(ball.xVel < 0 && ball.xPos <= 20 && ball.yPos >= otherTop && ball.yPos <= otherBottom){
      setPaddleCollide();
      return true;
    }
    else if(ball.xVel > 0 && ball.xPos + 26 >= 800 && ball.yPos >= myPaddleTop && ball.yPos <= myPaddleBottom){
      setPaddleCollide();
      return true;
    }
  }
  return false
}
function nearCenter(){return ball.xPos > 350 && ball.xPos < 450}

function setPaddleCollide(){
  paddleCollide = true;
  setTimeout(() => {paddleCollide = false;}, 500)
}

function clearBall(){
  ball.shape.clearRect(ball.xPos, ball.yPos, 6, 6)
}

function renderBall(){
  ball.shape.fillRect(ball.xPos, ball.yPos, 6, 6)
}
