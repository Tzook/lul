'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;
let _ = require('underscore');

export default class RoomsRouter extends SocketioRouterBase {
	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		console.log('logged user successfully');
		this.joinRoom(socket);
	}

	[SERVER_GETS.MOVE_ROOM](data, socket: GameSocket) {
		console.log('moving user room');
		if (this.middleware.canEnterRoom(data.room, socket.character.room)) {
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character});
			socket.leave(socket.character.room);
			socket.character.room = data.room;
			this.joinRoom(socket);
		}
	}

	[SERVER_GETS.DISCONNECT](data, socket: GameSocket) {
		console.log('disconnect');
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character});
	}

	private joinRoom(socket: GameSocket) {
		let room = socket.character.room;
		socket.broadcast.to(room).emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.character});
		let roomClients = (<any>this.io.sockets).adapter.rooms[room];
		if (roomClients) {
			_.each(roomClients.sockets, (value, socketId) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.map.get(socketId).character});
			});
		}
		socket.join(room);
	}
};