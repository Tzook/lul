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

        socket.emit(this.CLIENT_GETS.GAIN_EXP, {
            exp,
            now: socket.character.stats.exp
         });

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

    [config.SERVER_INNER.GAIN_HP] (data, socket: GameSocket) {
        let hp = data.hp;
        this.controller.addHp(socket.character, hp);

        socket.emit(this.CLIENT_GETS.GAIN_HP, {
            hp,
            now: socket.character.stats.hp.now
         });
    }

    [config.SERVER_INNER.GAIN_MP] (data, socket: GameSocket) {
        let mp = data.mp;
        this.controller.addMp(socket.character, mp);

        socket.emit(this.CLIENT_GETS.GAIN_MP, {
            mp,
            now: socket.character.stats.mp.now
         });
    }

    public onConnected(socket: GameSocket) {
        this.regenInterval(socket);
    }

    private regenInterval(socket: GameSocket) {
        setTimeout(() => {
            if (socket.connected) {
                this.emitter.emit(config.SERVER_INNER.GAIN_EXP, { exp: 30 }, socket);
                this.emitter.emit(config.SERVER_INNER.GAIN_HP, { hp: socket.character.stats.hp.regen }, socket);
                this.emitter.emit(config.SERVER_INNER.GAIN_MP, { mp: socket.character.stats.mp.regen }, socket);
                this.regenInterval(socket);
            }
        }, config.REGEN_INTERVAL);
    }
};
