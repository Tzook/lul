'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;

export default class ChatRouter extends SocketioRouterBase {
	[SERVER_GETS.SHOUT.name](data, socket: GameSocket) {
		socket.broadcast.emit(this.CLIENT_GETS.SHOUT.name, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[SERVER_GETS.CHAT.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHAT.name, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[SERVER_GETS.WHISPER.name](data, socket: GameSocket) {
		let targetSocket = socket.map.get(data.to);
		if (!targetSocket) {
			this.sendError(data, socket, "Failed to find socket for whisper");
		} else {
			targetSocket.emit(this.CLIENT_GETS.WHISPER.name, {
				name: socket.character.name,
				msg: data.msg,
			});
		}
	}
};
