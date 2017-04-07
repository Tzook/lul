'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
import * as _ from 'underscore';
let config = require('../../../server/lib/combat/combat.config.json');

export default class CombatRouter extends SocketioRouterBase {
	protected middleware: CombatMiddleware;

	[config.SERVER_GETS.LOAD_ATTACK](data, socket: GameSocket) {
		console.log("loading attack", socket.character.name);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility
		});
	}

	[config.SERVER_GETS.PERFORM_ATTACK](data, socket: GameSocket) {
		let load = this.middleware.getValidLoad(data.load);
		console.log("performing attack", socket.character.name, data, load);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility,
			load
		});
	}

	[config.SERVER_GETS.TAKE_DMG](data, socket: GameSocket) {
		let absoluteDmg: number = config.DMG[data.from];
        if (absoluteDmg) {
			// randomize the dmg
            let dmg = _.random(absoluteDmg - config.DMG_RANDOM_RANGE, absoluteDmg + config.DMG_RANDOM_RANGE);
			// make sure that after randomizing, dmg doesn't get negative
			dmg = Math.max(config.MIN_DMG_TAKEN, dmg); 
            socket.character.stats.hp.now = Math.max(0, socket.character.stats.hp.now - dmg);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.TAKE_DMG, {
                id: socket.character._id,
                dmg,
                hp: socket.character.stats.hp.now
            });
            console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
        } else {
            console.log("Tried to take dmg but invalid params", data.from);
        }
	}
};