'use strict';
let SocketioRouterBase = require('../socketio/socketio.router.base.js');
let SERVER_GETS		   = require('./movement.config.json').SERVER_GETS;

/**
 * Movement's router
 */
class MovementRouter extends SocketioRouterBase {
	[SERVER_GETS.MOVEMENT](data, socket) {
		console.log("Got movement", data);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MOVEMENT, {
			id: socket.character._id,
			x: data.x,
			y: data.y,
			z: data.z
		});
	}
}

module.exports = MovementRouter;