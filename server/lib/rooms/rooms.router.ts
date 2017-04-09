'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import RoomsController from './rooms.controller';
import RoomsMiddleware from "./rooms.middleware";
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;

export default class RoomsRouter extends SocketioRouterBase {
	protected middleware: RoomsMiddleware;
	protected controller: RoomsController;

	initRoutes(app) {
		this.controller.setIo(this.io);
		
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateRoom.bind(this.controller));
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		// const also used in items
		console.log('character %s entered room', socket.character.name);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.character});
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.map.get(socketId).character});
			});
		}

		this.controller.socketJoinRoom(socket);
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

			this.controller.socketLeaveRoom(socket, oldRoom);
		}
	}

	[SERVER_GETS.DISCONNECT](data, socket: GameSocket) {
		console.log('disconnect from room');
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, {
			 id: socket.character._id
		});

		this.controller.socketLeaveRoom(socket, socket.character.room);
	}

	[SERVER_GETS.BITCH_PLEASE](data, socket: GameSocket) {
		let key = data.key;
		console.log('bitch please received from %s with key %s', socket.character.name, key);
		this.controller.newBitchRequest(socket, key);
	}
};