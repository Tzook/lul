'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;
let _ = require('underscore');

export default class RoomsRouter extends SocketioRouterBase {
	[SERVER_GETS.ENTERED_ROOM](data, socket) {
		console.log('logged user successfully');
		var room = socket.character.room;
		socket.broadcast.to(room).emit(this.CLIENT_GETS.JOIN_ROOM, { character: socket.character});
		let roomClients = this.io.sockets.adapter.rooms[room];
		if (roomClients) {
			_.each(roomClients.sockets, (value, socketId) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.map.get(socketId).character});
			});
		}
		socket.join(room);
	}

	[SERVER_GETS.DISCONNECT](data, socket) {
		console.log('disconnect');
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character});
	}
};