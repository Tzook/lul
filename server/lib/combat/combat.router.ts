'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
import config from "../combat/combat.config";

export default class CombatRouter extends SocketioRouterBase {
	protected middleware: CombatMiddleware;

	[config.SERVER_GETS.LOAD_ATTACK.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility
		});
	}

	[config.SERVER_GETS.PERFORM_ATTACK.name](data, socket: GameSocket) {
		let load = this.middleware.getValidLoad(data.load);
		socket.lastAttackLoad = load;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility,
			load
		});
	}

	[config.SERVER_GETS.CHANGE_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		if (!ability) {
			this.sendError(data, socket, "Must send what ability to use");
		} else if (!this.middleware.canChangeAbility(socket, ability)) {
			this.sendError(data, socket, "Character cannot change to this ability");
		} else if (socket.character.stats.primaryAbility === ability) {
			this.sendError(data, socket, "Character already has this ability");
		} else {
			socket.character.stats.primaryAbility = ability;
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHANGE_ABILITY.name, {
				id: socket.character._id,
				ability: socket.character.stats.primaryAbility,
			});
		}
	}
};