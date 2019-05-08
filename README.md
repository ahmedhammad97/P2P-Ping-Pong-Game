# Multiplayer Ping-Pong game

### How to run
1. Clone / Download the repository
2. Make sure all dependencies are installed by typing: `npm install`
3. Run each client in a seperate terminal by typing: `node app.js`
4. A message should appear in the terminal stating how to view the game. ex: `Game available on: 192.168.1.21:5053` 
5. Using any two devices' browsers which is connected to the same network, connect to the server using these ip and port numbers.

### Major change
Due to the sudden update on Piazza, we had to refactor the project, moving it from Server-Client orientation, to Peer-To-Peer.

Therefor, I used a new package called `discovery-swarm`, which allows peer discovery for other devices sharing the same newtwork.

Also some major changes happened to the view-side and socket implementation.

### Progress track
The next steps are:
- ~~Designing the game GUI, perhaps using HTML5 Canvas or SVG.~~ Done.
- ~~Track the mouse movement on the client side, and send the Y-position whenever it changes.~~ Done.
- ~~Move the player whenever the mouse position changes.~~ Done.
- ~~Move the "ghost" player position whenever the client receives a new position update.~~ Done.
- ~~Draw the ball and Sync it's movement.~~ Done.
- ~~Add collision behaviour to it.~~ Done.
- ~~Sync ball movement on both clients~~ Done.
- ~~Count points/score and such.~~ Done.
- Styling
- Report
