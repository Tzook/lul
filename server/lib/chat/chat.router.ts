
import SocketioRouterBase from '../socketio/socketio.router.base';
import PartyRouter from '../party/party.router';
import config from '../chat/chat.config';

export default class ChatRouter extends SocketioRouterBase {
	protected partyRouter: PartyRouter;
	
	init(files, app) {
		super.init(files, app);
        this.partyRouter = files.routers.party;
	}

	[config.SERVER_GETS.SHOUT.name](data, socket: GameSocket) {
		socket.broadcast.emit(this.CLIENT_GETS.SHOUT.name, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[config.SERVER_GETS.CHAT.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHAT.name, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[config.SERVER_GETS.WHISPER.name](data, socket: GameSocket) {
		let targetSocket = socket.map.get(data.to);
		if (!targetSocket) {
			this.sendError(data, socket, "Failed to find socket for whisper");
		} else {
			targetSocket.emit(this.CLIENT_GETS.WHISPER.name, {
				name: socket.character.name,
				id: socket.character._id,
				msg: data.msg,
			});
		}
	}

	[config.SERVER_GETS.PARTY_CHAT.name](data, socket: GameSocket) {
		const party = this.partyRouter.getCharParty(socket);
		if (!party) {
			this.sendError(data, socket, "Failed to find party for engaging in party chat");
		} else {
			socket.broadcast.to(party.name).emit(this.CLIENT_GETS.PARTY_CHAT.name, {
				name: socket.character.name,
				id: socket.character._id,
				msg: data.msg,
			});
		}
	}
};
