'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/movement/movement.config.json').SERVER_GETS;

export default class MovementRouter extends SocketioRouterBase {
	[SERVER_GETS.MOVEMENT.name](data, socket: GameSocket) {
		var position = socket.character.position;
		position.x = data.x;
		position.y = data.y;
		position.z = data.z;
		if (socket.test) {
			console.log("movement", data, socket.character.name);
		}
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MOVEMENT.name, {
			id: socket.character._id,
			x: data.x,
			y: data.y,
			z: data.z,
			angle: data.angle
		});
	}

	[SERVER_GETS.START_CLIMB.name](data, socket: GameSocket) {
		socket.character.position.climbing = true;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.START_CLIMB.name, {
			id: socket.character._id,
		});
	}

	[SERVER_GETS.STOP_CLIMB.name](data, socket: GameSocket) {
		socket.character.position.climbing = false;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.STOP_CLIMB.name, {
			id: socket.character._id,
		});
	}
};