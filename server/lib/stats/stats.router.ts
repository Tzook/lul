
import SocketioRouterBase from '../socketio/socketio.router.base';
import StatsController from './stats.controller';
import StatsServices from './stats.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { BASE_STATS_SCHEMA } from "./stats.model";
import config from './stats.config';
import roomsConfig from '../rooms/rooms.config';
import PartyRouter from '../party/party.router';

export default class StatsRouter extends SocketioRouterBase {
    protected controller: StatsController;
    protected services: StatsServices;
    protected partyRouter: PartyRouter;

	init(files, app) {
        this.services = files.services;
        this.partyRouter = files.routers.party;
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
    }

    [config.SERVER_INNER.TAKE_DMG.name] (data, socket: GameSocket) {
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

    [config.SERVER_INNER.TOOK_DMG.name] (data, socket: GameSocket) {
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
        let {hp, crit} = data;
        let gainedHp = this.controller.addHp(socket, hp);

        if (gainedHp) {
            const party = this.partyRouter.getCharParty(socket);
            const to = party ? this.io.to(party.name) : socket;
            to.emit(config.CLIENT_GETS.GAIN_HP.name, {
                id: socket.character._id,
                name: socket.character.name,
                hp,
                crit,
                now: socket.character.stats.hp.now
            });
        }
    }

    [config.SERVER_INNER.GAIN_MP.name] (data, socket: GameSocket) {
        let mp = data.mp;
        let gainedMp = this.controller.addMp(socket, mp);

        if (gainedMp) {
            socket.emit(config.CLIENT_GETS.GAIN_MP.name, {
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

        socket.emit(config.CLIENT_GETS.GAIN_STATS.name, {
            stats: socket.character.stats
        });
    }

    [config.SERVER_GETS.RELEASE_DEATH.name] (data, socket: GameSocket) {
        socket.character.stats.hp.now = socket.maxHp;
        socket.emit(config.CLIENT_GETS.RESURRECT.name, {});
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
                    this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp }, socket);
                    this.regenHpInterval(socket);
                }
            }, socket.getHpRegenInterval());
        }
    }
    private regenMpInterval(socket: GameSocket) {
        if (socket.character.stats.mp.now < socket.maxMp) {
            clearTimeout(socket.mpRegenTimer);
            socket.mpRegenTimer = setTimeout(() => {
                if (socket.connected && socket.alive) {
                    const mp = this.services.getRegenMp(socket);
                    this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp }, socket);
                    this.regenMpInterval(socket);
                }
            }, socket.getMpRegenInterval());
        }
    }
};
