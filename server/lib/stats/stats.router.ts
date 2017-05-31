'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { BASE_STATS_SCHEMA } from "./stats.model";
let config = require('../../../server/lib/stats/stats.config.json');
let roomsConfig = require('../../../server/lib/rooms/rooms.config.json');

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;
    private hpTimeoutId: number;
    private mpTimeoutId: number;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

    [config.SERVER_INNER.GAIN_EXP.name] (data, socket: GameSocket) {
        let exp = data.exp;
        let currentLevel = socket.character.stats.lvl;
        this.controller.addExp(socket, exp);

        socket.emit(this.CLIENT_GETS.GAIN_EXP.name, {
            exp,
            now: socket.character.stats.exp
         });

        if (currentLevel !== socket.character.stats.lvl) {
            socket.emit(this.CLIENT_GETS.LEVEL_UP.name, {
                id: socket.character._id,
                stats: socket.character.stats
            });
            socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEVEL_UP.name, {
                id: socket.character._id,
                stats: {
                    lvl: socket.character.stats.lvl
                }
            });
        }
    }

    [config.SERVER_INNER.TAKE_DMG.name] (data, socket: GameSocket) {
        let dmg = data.dmg;
        let hpAfterDmg = this.services.getHpAfterDamage(socket.character.stats.hp.now, dmg);
        let hadFullHp = socket.character.stats.hp.now === socket.maxHp;
        socket.character.stats.hp.now = hpAfterDmg;
		this.io.to(socket.character.room).emit(this.CLIENT_GETS.TAKE_DMG.name, {
			id: socket.character._id,
			dmg,
			hp: socket.character.stats.hp.now
		});
		console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
        if (!socket.alive) {
            console.log("character %s is ded", socket.character.name);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.DEATH.name, {
                id: socket.character._id,
            });
        } else {
            this.regenHpIfNeeds(socket, hadFullHp);
        }
    }

    [config.SERVER_INNER.GAIN_HP.name] (data, socket: GameSocket) {
        let hp = data.hp;
        let gainedHp = this.controller.addHp(socket, hp);

        if (gainedHp) {
            socket.emit(this.CLIENT_GETS.GAIN_HP.name, {
                hp,
                now: socket.character.stats.hp.now
            });
        }
    }

    [config.SERVER_INNER.GAIN_MP.name] (data, socket: GameSocket) {
        let mp = data.mp;
        let gainedMp = this.controller.addMp(socket, mp);

        if (gainedMp) {
            socket.emit(this.CLIENT_GETS.GAIN_MP.name, {
                mp,
                now: socket.character.stats.mp.now
            });
        }
    }

    [config.SERVER_GETS.RELEASE_DEATH.name] (data, socket: GameSocket) {
        socket.character.stats.hp.now = socket.maxHp;
        socket.emit(this.CLIENT_GETS.RESURRECT.name, {});
        console.log("releasing death for", socket.character.name);
        this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
    }

    [config.SERVER_INNER.STATS_ADD.name] (data, socket: GameSocket) {
        this.toggleStats(data.stats, socket, true);
    }

    [config.SERVER_INNER.STATS_REMOVE.name] (data, socket: GameSocket) {
        this.toggleStats(data.stats, socket, false);
    }

    private toggleStats(stats: ITEM_INSTANCE, socket: GameSocket, on: boolean) {
        const sign = on ? 1 : -1;
        const hadFullHp = socket.character.stats.hp.now === socket.maxHp;
        for (var stat in BASE_STATS_SCHEMA) {
            if (stats[stat]) {
                socket.bonusStats[stat] += stats[stat] * sign;
            }
        }
        socket.bonusStats.hp += this.services.strToHp(stats.str || 0) * sign;
        socket.bonusStats.mp += this.services.magToMp(stats.mag || 0) * sign;
        if (socket.character.stats.hp.now > socket.maxHp) {
            socket.character.stats.hp.now = socket.maxHp;
        }
        if (socket.character.stats.mp.now > socket.maxMp) {
            socket.character.stats.mp.now = socket.maxMp;
        }
        this.regenHpIfNeeds(socket, hadFullHp);
    }

    public onConnected(socket: GameSocket) {
        Object.defineProperty(socket, 'alive', {get: () => socket.character.stats.hp.now > 0});
        Object.defineProperty(socket, 'maxHp', {get: () => socket.character.stats.hp.total + socket.bonusStats.hp});
        Object.defineProperty(socket, 'maxMp', {get: () => socket.character.stats.mp.total + socket.bonusStats.mp});
        socket.bonusStats = {};
        for (var stat in BASE_STATS_SCHEMA) {
            socket.bonusStats[stat] = 0;
        }
        // add the equips to memory
        for (var itemKey in EQUIPS_SCHEMA) {
            this[config.SERVER_INNER.STATS_ADD.name]({stats: socket.character.equips[itemKey]}, socket);
        }
        this.regenHpInterval(socket);
        this.regenMpInterval(socket);
    }

    private regenHpIfNeeds(socket: GameSocket, hadFullHp) {
        if (hadFullHp && socket.character.stats.hp.now < socket.maxHp) {
            this.regenHpInterval(socket);
        }
    }

    private regenHpInterval(socket: GameSocket) {
        if (socket.character.stats.hp.now < socket.maxHp) {
            clearTimeout(this.hpTimeoutId);
            this.hpTimeoutId = setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp: socket.character.stats.hp.regen }, socket);
                    this.regenHpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
    private regenMpInterval(socket: GameSocket) {
        if (socket.character.stats.mp.now < socket.maxMp) {
            clearTimeout(this.mpTimeoutId);
            this.mpTimeoutId = setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp: socket.character.stats.mp.regen }, socket);
                    this.regenMpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
};
