'use strict';
let SocketioRouterBase = require('../socketio/socketio.router.base.js');
let SERVER_GETS		 = require('./rooms.config.json').SERVER_GETS;

class RoomsRouter extends SocketioRouterBase {
	[SERVER_GETS.ENTERED_ROOM](data, socket) {
		console.log('logged user successfully');
		var room = socket.character.room;
		socket.join(room);
		socket.broadcast.to(room).emit(this.CLIENT_GETS.JOIN_ROOM, { character: socket.character});
		socket.map.forEach(userSocket => {
			socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: userSocket.character});
		});
		socket.map.set(socket.character.name, socket);
	}

	[SERVER_GETS.DISCONNECT](data, socket) {
		console.log('disconnect');
		this.userLeftRoom(socket);
	}

	[SERVER_GETS.LEFT_ROOM](data, socket) {
		console.log('user left room');
		this.userLeftRoom(socket);
	}

	userLeftRoom(socket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character});
		socket.map.delete(socket.character.name);
	}
}

module.exports = RoomsRouter;