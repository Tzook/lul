'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import config from "../emote/emote.config";

export default class EmoteRouter extends SocketioRouterBase {
	[config.SERVER_GETS.EMOTE.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.EMOTE.name, {
			id: socket.character._id,
			type: data.type,
			emote: data.emote,
		});
	}
};
