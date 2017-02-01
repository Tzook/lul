'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import * as _ from 'underscore';
let config = require('../../../server/lib/stats/stats.config.json');

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;

    [config.SERVER_INNER.GAIN_EXP] (data, socket: GameSocket) {
        let exp = data.exp;
        let currentLevel = socket.character.stats.lvl;
        this.controller.addExp(socket.character, exp);

        socket.emit(this.CLIENT_GETS.GAIN_EXP, { exp });

        if (currentLevel !== socket.character.stats.lvl) {
            socket.emit(this.CLIENT_GETS.LEVEL_UP, {
                id: socket.character._id,
                stats: socket.character.stats
            });
            socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEVEL_UP, {
                id: socket.character._id,
                stats: {
                    lvl: socket.character.stats.lvl
                }
            });
        }
    }

	[config.SERVER_GETS.TAKE_DMG](data, socket: GameSocket) {
		let from = data.from;
        if (from && config.DMG[from]) {
            let dmg = _.random(config.DMG[from] - config.DMG_RANDOM_RANGE, config.DMG[from] + config.DMG_RANDOM_RANGE);
            socket.character.stats.hp.now = Math.max(0, socket.character.stats.hp.now - dmg);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.TAKE_DMG, {
                id: socket.character._id,
                dmg,
                hp: socket.character.stats.hp.now
            });
            console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
        } else {
            console.log("Tried to take dmg but invalid params", from);
        }
	}
};
