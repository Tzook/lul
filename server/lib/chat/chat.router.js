'use strict';
let SocketioRouterBase = require('../socketio/socketio.router.base.js');
let SERVER_GETS		   = require('./chat.config.json').SERVER_GETS;

/**
 * Chat's router
 */
class ChatRouter extends SocketioRouterBase {
	[SERVER_GETS.MESSAGE](data, socket) {
		console.log("Got message", data);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MESSAGE, {
			id: socket.character._id,
			message: data.message
		});
	}
}

module.exports = ChatRouter;