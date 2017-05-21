'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let SERVER_GETS		   = require('../../../server/lib/emote/emote.config.json').SERVER_GETS;

export default class EmoteRouter extends SocketioRouterBase {
	[SERVER_GETS.EMOTE.name](data, socket: GameSocket) {
		console.log("got an emote", socket.character.name, data);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.EMOTE.name, {
			id: socket.character._id,
			type: data.type,
			emote: data.emote,
		});
	}
};
