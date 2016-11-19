'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;

export default class ChatRouter extends SocketioRouterBase {
	[SERVER_GETS.MESSAGE](data, socket) {
		let emit = to => {
			to.emit(this.CLIENT_GETS.MESSAGE, {
				id: socket.character._id,
				message: data.message,
				type: data.type
			});
		}

		console.log("Got message", data);
		if (data.type === "whisper" && data.target_id) {
			let targetSocket = socket.map.get(data.target_id);
			if (!targetSocket) {
				console.error("Failed to find socket!", data);
			} else {
				emit(targetSocket);
			}
		} else if (data.type === "global") {
			emit(socket.broadcast);
		} else { // scene
			emit(socket.broadcast.to(socket.character.room));
		}
	}
};
