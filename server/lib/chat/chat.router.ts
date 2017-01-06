'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;

export default class ChatRouter extends SocketioRouterBase {
	[SERVER_GETS.SHOUT](data, socket) {
		console.log("Emitting shout", data);
		socket.broadcast.emit(this.CLIENT_GETS.SHOUT, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[SERVER_GETS.CHAT](data, socket) {
		console.log("Emitting chat", data);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHAT, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[SERVER_GETS.WHISPER](data, socket) {
		if (typeof data.to_id == 'string') {
			let targetSocket = socket.map.get(data.target_id);
			if (!targetSocket) {
				console.error("Failed to find socket for whisper!", data);
			} else {
				console.log("Emitting whisper", data);
				targetSocket.emit(this.CLIENT_GETS.WHISPER, {
					id: socket.character._id,
					msg: data.msg,
				});
			}
		} else {
			console.log("did not provide to_id in data for whisper!", data);
		}
	}
};
