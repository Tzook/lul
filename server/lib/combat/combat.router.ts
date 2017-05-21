'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
let config = require('../../../server/lib/combat/combat.config.json');

export default class CombatRouter extends SocketioRouterBase {
	protected middleware: CombatMiddleware;

	[config.SERVER_GETS.LOAD_ATTACK.name](data, socket: GameSocket) {
		if (!socket.alive) {
			this.sendError({}, socket, "Character is not alive!");
            return;
        }
		console.log("loading attack", socket.character.name);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility
		});
	}

	[config.SERVER_GETS.PERFORM_ATTACK.name](data, socket: GameSocket) {
		if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		let load = this.middleware.getValidLoad(data.load);
		socket.lastAttackLoad = load;
		console.log("performing attack", socket.character.name, data, load);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility,
			load
		});
	}
};