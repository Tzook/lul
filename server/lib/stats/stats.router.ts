'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { BASE_STATS_SCHEMA } from "./stats.model";
import config from "./stats.config";
import roomsConfig from "../rooms/rooms.config";

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;
    private hpTimeoutId: NodeJS.Timer;
    private mpTimeoutId: NodeJS.Timer;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

    [config.SERVER_INNER.GAIN_EXP.name] (data, socket: GameSocket) {
        let exp = data.exp;
        if (!(exp > 0)) {
            return this.sendError(data, socket, "trying to gain exp that is not positive");
        }
        let currentLevel = socket.character.stats.lvl;
        this.controller.addExp(socket, exp);

        socket.emit(this.CLIENT_GETS.GAIN_EXP.name, {
            exp,
            now: socket.character.stats.exp
         });

        if (currentLevel !== socket.character.stats.lvl) {
            this.emitter.emit(config.SERVER_INNER.GAIN_LVL.name, {}, socket);
        }
    }

    [config.SERVER_INNER.GAIN_LVL.name] (data, socket: GameSocket) {
        this.io.to(socket.character.room).emit(this.CLIENT_GETS.LEVEL_UP.name, {
            id: socket.character._id,
        });
        socket.emit(this.CLIENT_GETS.GAIN_STATS.name, {
            stats: socket.character.stats
        });
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
        if (!socket.alive) {
            this.log({}, socket,  "character is ded");
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.DEATH.name, {
                id: socket.character._id,
            });
        } else {
            hadFullHp && this.regenHpInterval(socket);
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

    [config.SERVER_INNER.GAIN_STATS.name] (data: {stats: BASE_STATS_MODEL}, socket: GameSocket) {
        let {stats} = data;
        
        this.services.addStr(socket.character.stats, stats.str || 0);
        this.services.addMag(socket.character.stats, stats.mag || 0);
        this.services.addDex(socket.character.stats, stats.dex || 0);
        this.services.addHp(socket.character.stats, stats.hp || 0);
        this.services.addMp(socket.character.stats, stats.mp || 0);

        socket.emit(this.CLIENT_GETS.GAIN_STATS.name, {
            stats: socket.character.stats
        });
    }

    [config.SERVER_GETS.RELEASE_DEATH.name] (data, socket: GameSocket) {
        socket.character.stats.hp.now = socket.maxHp;
        socket.emit(this.CLIENT_GETS.RESURRECT.name, {});
        this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
    }

    [config.SERVER_INNER.STATS_ADD.name] (data, socket: GameSocket) {
        this.toggleStats(data.stats, socket, true, data.validate);
    }

    [config.SERVER_INNER.STATS_REMOVE.name] (data, socket: GameSocket) {
        this.toggleStats(data.stats, socket, false, true);
    }

    private toggleStats(stats: ITEM_INSTANCE, socket: GameSocket, on: boolean, validate = true) {
        const sign = on ? 1 : -1;
        const hadFullHp = socket.character.stats.hp.now === socket.maxHp;
        for (var stat in BASE_STATS_SCHEMA) {
            if (stats[stat]) {
                socket.bonusStats[stat] += stats[stat] * sign;
            }
        }
        socket.bonusStats.hp += this.services.strToHp(stats.str || 0) * sign;
        socket.bonusStats.mp += this.services.magToMp(stats.mag || 0) * sign;
        if (validate) {
            if (socket.character.stats.hp.now > socket.maxHp) {
                socket.character.stats.hp.now = socket.maxHp;
            }
            if (socket.character.stats.mp.now > socket.maxMp) {
                socket.character.stats.mp.now = socket.maxMp;
            }
            hadFullHp && this.regenHpInterval(socket);
        }
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
            this[config.SERVER_INNER.STATS_ADD.name]({stats: socket.character.equips[itemKey], validate: false}, socket);
        }
        this.regenHpInterval(socket);
        this.regenMpInterval(socket);
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
