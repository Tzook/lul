'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
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
};
