'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;


export default class RoomsRouter extends SocketioRouterBase {
	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		// const also used in items
		console.log('logged user successfully');
		let room = socket.character.room;
		socket.broadcast.to(room).emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.character});
		let roomClients = (<any>this.io.sockets).adapter.rooms[room];
		if (roomClients) {
			_.each(roomClients.sockets, (value, socketId: string) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.map.get(socketId).character});
			});
		}
		socket.join(room);
	}

	[SERVER_GETS.MOVE_ROOM](data, socket: GameSocket) {
		console.log('moving user room');
		if (this.middleware.canEnterRoom(data.room, socket.character.room)) {
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, {
				 id: socket.character._id
			});
			let oldRoom = socket.character.room;
			socket.leave(oldRoom);
			socket.character.room = data.room;
			socket.emit(this.CLIENT_GETS.MOVE_ROOM, {from: oldRoom, to: data.room});
		}
	}

	[SERVER_GETS.DISCONNECT](data, socket: GameSocket) {
		console.log('disconnect from room');
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, {
			 id: socket.character._id
		});
	}
};