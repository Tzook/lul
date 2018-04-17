
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
import { BASE_STATS_SCHEMA } from "./stats.model";
import config from './stats.config';
import roomsConfig from '../rooms/rooms.config';
import * as _ from "underscore";
import combatConfig from '../combat/combat.config';
import { getCharParty } from '../party/party.services';

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;

	init(files, app) {
        this.services = files.services;
		super.init(files, app);
    }
    
    public getExp(level: number) {
        return this.services.getExp(level);
    }

    [config.SERVER_INNER.GAIN_EXP.name] (data, socket: GameSocket) {
        let exp = data.exp;
        if (!(exp > 0)) {
            return this.sendError(data, socket, "trying to gain exp that is not positive");
        }
        let currentLevel = socket.character.stats.lvl;
        this.controller.addExp(socket, exp);

        socket.emit(config.CLIENT_GETS.GAIN_EXP.name, {
            exp,
            now: socket.character.stats.exp
         });

        if (currentLevel !== socket.character.stats.lvl) {
            this.emitter.emit(config.SERVER_INNER.GAIN_LVL.name, {}, socket);
        }
    }

    [config.SERVER_INNER.GAIN_LVL.name] (data, socket: GameSocket) {
        this.io.to(socket.character.room).emit(config.CLIENT_GETS.LEVEL_UP.name, {
            id: socket.character._id,
            name: socket.character.name,
        });
        socket.emit(config.CLIENT_GETS.GAIN_STATS.name, {
            stats: socket.character.stats
        });
        this.updateMaxStats(socket, true, true);
    }

    [config.SERVER_GETS.TAKE_WORLD_DAMAGE.name] (data: {dmg, perks?}, socket: GameSocket) {
        let {dmg, perks} = data;
        let hurter: PERKABLE = {};
        // convert perks array to an object
        if (_.isArray(perks)) {
            for (let perkObject of perks) {
                if (_.isObject(perkObject) && _.isString(perkObject.key) && !_.isNaN(+perkObject.value)) {
                    hurter.perks = hurter.perks || {};
                    hurter.perks[perkObject.key] = +perkObject.value;
                }
            }
        }
        dmg = +dmg;
        if (!(dmg > 0)) {
            return this.sendError(data, socket, "Must mention how much damage to take");
        }
        let cause = combatConfig.HIT_CAUSE.ATK;
        this.emitter.emit(config.SERVER_INNER.TAKE_DMG.name, {
            dmg,
            cause,
            hurter
        }, socket);
    }

    [config.SERVER_INNER.TAKE_DMG.name] (data: {dmg, cause, crit, hurter}, socket: GameSocket) {
        let dmg = data.dmg;
        let hpAfterDmg = this.services.getHpAfterDamage(socket.character.stats.hp.now, dmg);
        let hadFullHp = socket.character.stats.hp.now === socket.maxHp;
        socket.character.stats.hp.now = hpAfterDmg;
        
        this.emitter.emit(config.SERVER_INNER.TOOK_DMG.name, data, socket);

        if (!socket.alive) {
            this.log({}, socket, "character is ded");
            this.io.to(socket.character.room).emit(config.CLIENT_GETS.DEATH.name, {
                id: socket.character._id,
            });
        } else {
            hadFullHp && this.regenHpInterval(socket);
        }
    }

    [config.SERVER_INNER.TOOK_DMG.name] (data: {dmg, cause, crit, hurter}, socket: GameSocket) {
        let {dmg, cause, crit} = data;
		this.io.to(socket.character.room).emit(config.CLIENT_GETS.TAKE_DMG.name, {
			id: socket.character._id,
            dmg,
            cause,
            crit,
			hp: socket.character.stats.hp.now
        });
    }

    [config.SERVER_INNER.USE_MP.name] (data, socket: GameSocket) {
        const {mp} = data;
        let hadFullMp = socket.character.stats.mp.now === socket.maxMp;
        const now = this.services.getMpAfterUsage(socket.character.stats.mp.now, mp);
        socket.character.stats.mp.now = now
        socket.emit(config.CLIENT_GETS.USE_MP.name, { mp, now });
        if (hadFullMp) {
            this.regenMpInterval(socket);
        }
    }

    [config.SERVER_INNER.GAIN_HP.name] (data, socket: GameSocket) {
        let {hp, crit, cause = config.REGEN_CAUSE.OTHER} = data;
        let gainedHp = this.controller.addHp(socket, hp);

        if (gainedHp) {
            const party = getCharParty(socket);
            const to = party ? this.io.to(party.name) : socket;
            to.emit(config.CLIENT_GETS.GAIN_HP.name, {
                id: socket.character._id,
                name: socket.character.name,
                hp,
                crit,
                cause,
                now: socket.character.stats.hp.now
            });
        }
    }

    [config.SERVER_INNER.GAIN_MP.name] (data, socket: GameSocket) {
        let {mp, cause = config.REGEN_CAUSE.OTHER} = data;
        let gainedMp = this.controller.addMp(socket, mp);

        if (gainedMp) {
            socket.emit(config.CLIENT_GETS.GAIN_MP.name, {
                mp,
                cause,
                now: socket.character.stats.mp.now
            });
        }
    }

    [config.SERVER_INNER.GAIN_STATS.name] (data: {stats: BASE_STATS_MODEL}, socket: GameSocket) {
        let {stats} = data;
        const oldMaxHp = socket.maxHp;
        const oldMaxMp = socket.maxMp;
        
        this.services.addHp(socket.character.stats, stats.hp || 0);
        this.services.addMp(socket.character.stats, stats.mp || 0);

        socket.emit(config.CLIENT_GETS.GAIN_STATS.name, {
            stats: socket.character.stats
        });

        if (oldMaxHp !== socket.maxHp || oldMaxMp !== socket.maxMp) {
            this.updateMaxStats(socket, oldMaxHp !== socket.maxHp, oldMaxMp !== socket.maxMp);
        }
    }

    [config.SERVER_GETS.RELEASE_DEATH.name] (data, socket: GameSocket) {
        socket.character.stats.hp.now = socket.maxHp;
        socket.emit(config.CLIENT_GETS.RESURRECT.name, {});
        this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
    }

    [config.SERVER_INNER.STATS_ADD.name] (data: {stats: ITEM_INSTANCE, checkMaxStats: boolean}, socket: GameSocket) {
        const {stats, checkMaxStats} = data;

        if (checkMaxStats) {
            var oldMaxHp = socket.maxHp;
            var oldMaxMp = socket.maxMp;
        }

        const hadFullHp = socket.character.stats.hp.now >= socket.maxHp;
        const hadFullMp = socket.character.stats.mp.now >= socket.maxMp;
        for (var stat in BASE_STATS_SCHEMA) {
            if (stats[stat]) {
                socket.bonusStats[stat] += stats[stat];
            }
        }
        if (socket.character.stats.hp.now > socket.maxHp) {
            let hpToRemove = socket.character.stats.hp.now - socket.maxHp;
            this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp: -hpToRemove }, socket);
        }
        if (socket.character.stats.mp.now > socket.maxMp) {
            let mpToRemove = socket.character.stats.mp.now - socket.maxMp;
            this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp: -mpToRemove }, socket);
        }
        if (hadFullHp && !socket.hpRegenTimer) {
            this.regenHpInterval(socket);
        }
        if (hadFullMp && !socket.mpRegenTimer) {
            this.regenMpInterval(socket);
        }

        if (checkMaxStats) {
            if (oldMaxHp !== socket.maxHp || oldMaxMp !== socket.maxMp) {
                this.updateMaxStats(socket, oldMaxHp !== socket.maxHp, oldMaxMp !== socket.maxMp);
            }
        }
    }

    protected updateMaxStats(socket: GameSocket, hpChanged: boolean, mpChanged: boolean) {
        this.emitter.emit(config.SERVER_INNER.UPDATE_MAX_STATS.name, {
            hp: hpChanged,
            mp: mpChanged,
        }, socket);
    }
    
    [config.SERVER_INNER.UPDATE_MAX_STATS.name](data: {hp, mp}, socket: GameSocket) {
        // ...
    }

    public onConnected(socket: GameSocket) {
        Object.defineProperty(socket, 'alive', {get: () => socket.character.stats.hp.now > 0});
        Object.defineProperty(socket, 'maxHp', {get: () => socket.character.stats.hp.total + socket.bonusStats.hp});
        Object.defineProperty(socket, 'maxMp', {get: () => socket.character.stats.mp.total + socket.bonusStats.mp});
        socket.bonusStats = {};
        for (var stat in BASE_STATS_SCHEMA) {
            socket.bonusStats[stat] = 0;
        }
        process.nextTick(() => {
            this.regenHpInterval(socket);
            this.regenMpInterval(socket);
        });
    }

    private regenHpInterval(socket: GameSocket) {
        if (socket.character.stats.hp.now < socket.maxHp) {
            clearTimeout(socket.hpRegenTimer);
            socket.hpRegenTimer = setTimeout(() => {
                if (socket.connected && socket.alive) {
                    const hp = this.services.getRegenHp(socket);
                    this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp, cause: config.REGEN_CAUSE.REGEN }, socket);
                    this.regenHpInterval(socket);
                }
            }, socket.getHpRegenInterval());
        } else {
            socket.hpRegenTimer = null;
        }
    }
    private regenMpInterval(socket: GameSocket) {
        if (socket.character.stats.mp.now < socket.maxMp) {
            clearTimeout(socket.mpRegenTimer);
            socket.mpRegenTimer = setTimeout(() => {
                if (socket.connected && socket.alive) {
                    const mp = this.services.getRegenMp(socket);
                    this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp, cause: config.REGEN_CAUSE.REGEN }, socket);
                    this.regenMpInterval(socket);
                }
            }, socket.getMpRegenInterval());
        } else {
            socket.mpRegenTimer = null;
        }
    }
};
