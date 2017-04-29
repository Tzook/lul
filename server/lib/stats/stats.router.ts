'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
let config = require('../../../server/lib/stats/stats.config.json');
let roomsConfig = require('../../../server/lib/rooms/rooms.config.json');

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

    [config.SERVER_INNER.GAIN_EXP] (data, socket: GameSocket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
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
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
        let hp = data.hp;
        this.controller.addHp(socket.character, hp);

        socket.emit(this.CLIENT_GETS.GAIN_HP, {
            hp,
            now: socket.character.stats.hp.now
         });
    }

    [config.SERVER_INNER.TAKE_DMG] (data, socket: GameSocket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
        let dmg = data.dmg;
        socket.character.stats.hp.now = this.services.getHpAfterDamage(socket.character.stats.hp.now, dmg);
		this.io.to(socket.character.room).emit(this.CLIENT_GETS.TAKE_DMG, {
			id: socket.character._id,
			dmg,
			hp: socket.character.stats.hp.now
		});
		console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
    }

    [config.SERVER_INNER.GAIN_MP] (data, socket: GameSocket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
        let mp = data.mp;
        this.controller.addMp(socket.character, mp);

        socket.emit(this.CLIENT_GETS.GAIN_MP, {
            mp,
            now: socket.character.stats.mp.now
         });
    }

    [config.SERVER_GETS.RELEASE_DEATH] (data, socket: GameSocket) {
        if (socket.alive) {
            this.sendError({}, socket, "Character is alive!");
            return;
        }
        socket.character.stats.hp.now = socket.character.stats.hp.total;
        this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN, {}, socket);
    }

    public onConnected(socket: GameSocket) {
        this.regenInterval(socket);
        Object.defineProperty(socket, 'alive', {get: () => {
            return socket.character.stats.hp.now > 0;
        }});
    }

    private regenInterval(socket: GameSocket) {
        setTimeout(() => {
            if (socket.connected) {
                this.emitter.emit(config.SERVER_INNER.GAIN_HP, { hp: socket.character.stats.hp.regen }, socket);
                this.emitter.emit(config.SERVER_INNER.GAIN_MP, { mp: socket.character.stats.mp.regen }, socket);
                this.regenInterval(socket);
            }
        }, config.REGEN_INTERVAL);
    }
};
