'use strict';
let SocketioRouterBase = require('../socketio/socketio.router.base.js');
let SERVER_GETS		 = require('./rooms.config.json').SERVER_GETS;

class RoomsRouter extends SocketioRouterBase {
	[SERVER_GETS.ENTERED_ROOM](data, socket) {
		console.log('logged user successfully');
		socket.broadcast.emit(this.CLIENT_GETS.JOIN_ROOM, { character: socket.character});
		socket.map.forEach(userSocket => {
			socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: userSocket.character});
		});
		socket.map.set(socket.character.name, socket);
	}
}

module.exports = RoomsRouter;