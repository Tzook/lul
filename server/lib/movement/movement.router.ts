'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/movement/movement.config.json').SERVER_GETS;

export default class MovementRouter extends SocketioRouterBase {
	[SERVER_GETS.MOVEMENT](data, socket: GameSocket) {
		console.log("Got movement", data);
		var position = socket.character.position;
		position.x = data.x;
		position.y = data.y;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MOVEMENT, {
			id: socket.character._id,
			x: data.x,
			y: data.y,
			angle: data.angle
		});
	}
};