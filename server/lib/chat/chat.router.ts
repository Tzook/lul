'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;

export default class ChatRouter extends SocketioRouterBase {
	[SERVER_GETS.MESSAGE](data, socket) {
		console.log("Got message", data);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MESSAGE, {
			id: socket.character._id,
			message: data.message
		});
	}
};