'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
import { ITEM_STATS_SCHEMA } from "../items/items.model";
import { EQUIPS_SCHEMA } from '../equips/equips.model';
let config = require('../../../server/lib/stats/stats.config.json');
let roomsConfig = require('../../../server/lib/rooms/rooms.config.json');

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

    [config.SERVER_INNER.GAIN_EXP.name] (data, socket: GameSocket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
        let exp = data.exp;
        let currentLevel = socket.character.stats.lvl;
        this.controller.addExp(socket.character, exp);

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
        let shouldStartRegen = socket.character.stats.hp.now === socket.character.stats.hp.total && hpAfterDmg < socket.character.stats.hp.now;
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
        } else if (shouldStartRegen) {
            this.regenHpInterval(socket);
        }
    }

    [config.SERVER_INNER.GAIN_HP.name] (data, socket: GameSocket) {
        let hp = data.hp;
        let gainedHp = this.controller.addHp(socket.character, hp);

        if (gainedHp) {
            socket.emit(this.CLIENT_GETS.GAIN_HP.name, {
                hp,
                now: socket.character.stats.hp.now
            });
        }
    }

    [config.SERVER_INNER.GAIN_MP.name] (data, socket: GameSocket) {
        let mp = data.mp;
        let gainedMp = this.controller.addMp(socket.character, mp);

        if (gainedMp) {
            socket.emit(this.CLIENT_GETS.GAIN_MP.name, {
                mp,
                now: socket.character.stats.mp.now
            });
        }
    }

    [config.SERVER_GETS.RELEASE_DEATH.name] (data, socket: GameSocket) {
        if (socket.alive) {
            this.sendError({}, socket, "Character is alive!");
            return;
        }
        socket.character.stats.hp.now = socket.character.stats.hp.total;
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
        for (var stat in ITEM_STATS_SCHEMA) {
            if (stats[stat]) {
                socket.bonusStats[stat] = socket.bonusStats[stat] + stats[stat] * (on ? 1 : -1);
            }
        }
    }

    public onConnected(socket: GameSocket) {
        this.regenHpInterval(socket);
        this.regenMpInterval(socket);
        Object.defineProperty(socket, 'alive', {get: () => {
            return socket.character.stats.hp.now > 0;
        }});
        socket.bonusStats = {};
        for (var stat in ITEM_STATS_SCHEMA) {
            socket.bonusStats[stat] = 0;
        }
        // add the equips to memory
        for (var itemKey in EQUIPS_SCHEMA) {
            this[config.SERVER_INNER.STATS_ADD.name]({stats: socket.character.equips[itemKey]}, socket);
        }
    }

    private regenHpInterval(socket: GameSocket) {
        if (socket.character.stats.hp.now < socket.character.stats.hp.total) {
            setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp: socket.character.stats.hp.regen }, socket);
                    this.regenHpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
    private regenMpInterval(socket: GameSocket) {
        if (socket.character.stats.mp.now < socket.character.stats.mp.total) {
            setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp: socket.character.stats.mp.regen }, socket);
                    this.regenMpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
};
