'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
let config = require('../../../server/lib/party/party.config.json');

export default class PartyRouter extends SocketioRouterBase {
	[config.SERVER_GETS.CREATE_PARTY.name](data, socket: GameSocket) {
        console.log("CREATE_PARTY", socket.character);
	}

	[config.SERVER_GETS.INVITE_TO_PARTY.name](data, socket: GameSocket) {
        console.log("INVITE_TO_PARTY", socket.character);
	}

	[config.SERVER_GETS.JOIN_PARTY.name](data, socket: GameSocket) {
        console.log("JOIN_PARTY", socket.character);
	}

	[config.SERVER_GETS.LEAVE_PARTY.name](data, socket: GameSocket) {
        console.log("LEAVE_PARTY", socket.character);
	}

	[config.SERVER_GETS.KICK_FROM_PARTY.name](data, socket: GameSocket) {
        console.log("KICK_FROM_PARTY", socket.character);
	}
};
