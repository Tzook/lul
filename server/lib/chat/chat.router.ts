import SocketioRouterBase from '../socketio/socketio.router.base';
import config from '../chat/chat.config';
import ChatServices from './chat.services';
import { getCharParty } from '../party/party.services';

export default class ChatRouter extends SocketioRouterBase {
	protected services: ChatServices;
	
	init(files, app) {
		super.init(files, app);
        this.services = files.services;
	}

    [config.GLOBAL_EVENTS.GLOBAL_ITEMS_READY.name](data) {
		this.services.improveItemsKeysForHax(data);
    }

    [config.GLOBAL_EVENTS.GLOBAL_ROOMS_READY.name](data) {
		this.services.improveRoomsKeysForHax(data);
    }

    [config.GLOBAL_EVENTS.GLOBAL_MOBS_READY.name](data) {
		this.services.improveMobsKeysForHax(data);
    }

	[config.SERVER_GETS.SHOUT.name](data, socket: GameSocket) {
		socket.broadcast.emit(this.CLIENT_GETS.SHOUT.name, {
			id: socket.character._id,
			msg: data.msg,
		});
	}

	[config.SERVER_GETS.CHAT.name](data, socket: GameSocket) {
		if (socket.user.boss && this.services.useHax(socket, data.msg)) {
			this.log({hax: data.msg}, socket, "User used hax");
			return;
		}
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
		const party = getCharParty(socket);
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
