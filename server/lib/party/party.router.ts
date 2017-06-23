'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import PartyController from './party.controller';
let config = require('../../../server/lib/party/party.config.json');

export default class PartyRouter extends SocketioRouterBase {
    protected controller: PartyController;
    
    [config.SERVER_GETS.CREATE_PARTY.name](data, socket: GameSocket) {
	}

	[config.SERVER_GETS.INVITE_TO_PARTY.name](data, socket: GameSocket) {
	}

	[config.SERVER_GETS.JOIN_PARTY.name](data, socket: GameSocket) {
	}

	[config.SERVER_GETS.LEAVE_PARTY.name](data, socket: GameSocket) {
	}

	[config.SERVER_GETS.KICK_FROM_PARTY.name](data, socket: GameSocket) {
	}
};
