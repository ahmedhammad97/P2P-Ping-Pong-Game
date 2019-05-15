# P2P Ping-Pong Game

## How to run
1. Clone or download the repository.
2. Make sure [Node.js](https://nodejs.org/en/) is installed.
3. Make sure all dependencies are installed by typing: `npm install`.
4. Run each client in a separate terminal - or perhaps separate device - by typing: `node app.js`.
5. A message should appear in the terminal stating how to view the game. ex: `Game available on: 192.168.1.21:5053`.
6. Using any two browsers which are connected to the same network, connect to the server using these IP and port numbers.

## How it works
#### Back-end
After running `app.js`, a "Peer Discovery" module is called, which searches for any peer in the same network who has the same interest topic.

When a peer is found, a connection is established between them, allowing message passing through sockets. A subroutine is called asynchronously to start the game for the two clients.

A web socket server is initialized, waiting for a connection from the front-end.

The back-end does not modify the messages that it receives from either the other peer, or from it's front-end, but rather just passes it.

![Archeticture diagram](https://github.com/ahmedhammad97/P2P-Ping-Pong-game/blob/master/screenshots/archeticture.png)

#### Front-end
After typing the IP address and port number in the browser, the game canvas loads, and the front-end connects to the back-end through a web socket.

When the front-end gets notified that the game has started, it keeps track of the paddle's position, ball position, ball velocity, and the scores.

It then starts transmitting each value to the back-end, each with it's transmission rate.

Paddle position is transmitted every few hundreds milliseconds, which ball position for example, is transmitted every few seconds, only to ensure synchronousness (there is not any random factor in calculating the ball position).


## Technologies
- Node.js
- Express.js
- Dgram
- Net
- Ejs view engine
- Ws (websocket server)

## Screenshots
![Screenshot](https://github.com/ahmedhammad97/P2P-Ping-Pong-game/blob/master/screenshots/sc1.png)

![Screenshot](https://github.com/ahmedhammad97/P2P-Ping-Pong-game/blob/master/screenshots/sc2.png)
