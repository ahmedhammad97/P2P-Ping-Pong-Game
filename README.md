# Multiplayer Ping-Pong game

### How to run
1. Clone / Download the repository
2. Make sure all dependencies are installed by typing: `npm install`
3. Run the server by typing: `node server.js`
4. Now, using any device connected to the same network, connect to the server as follows:
	1. If the device running the server has an IP of `192.168.1.5` for example
	2. type in the browser: `http://192.168.1.5:5050`


### Progress track
The current state is that the server allows only 2 clients to connect, and reject any further connections.
After exactly 2 connection, the server calls `startGame()` function, which currently only sends a message to the client.

The next steps are:
- Designing the game GUI, perhaps using HTML5 Canvas or SVG.
- ~~Track the mouse movement on the client side, and send the Y-position whenever it changes.~~ Done.
- Move the player whenever the mouse position changes.
- Move the "ghost" player position whenever the client receives a new position update.
