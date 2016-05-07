'use strict';
let SocketioRouterBase = require('../socketio/socketio.router.base.js');
let SERVER_GETS		 = require('./movement.config.json').SERVER_GETS;

/**
 * Movement's router
 */
class MovementRouter extends SocketioRouterBase {
	[SERVER_GETS.LOCATION](data, socket) {
		socket.character.pos.x = data.x;
		socket.character.pos.y = data.y;
		this.io.emit(this.CLIENT_GETS.LOCATION, {x: data.x, y: data.y, ch: socket.character.name});
	}
}

module.exports = MovementRouter;