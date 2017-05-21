'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
const items_model_1 = require("../items/items.model");
const equips_model_1 = require("../equips/equips.model");
let config = require('../../../server/lib/stats/stats.config.json');
let roomsConfig = require('../../../server/lib/rooms/rooms.config.json');
class StatsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.services = files.services;
        super.init(files, app);
    }
    [config.SERVER_INNER.GAIN_EXP.name](data, socket) {
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
    [config.SERVER_INNER.TAKE_DMG.name](data, socket) {
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
        }
        else if (shouldStartRegen) {
            this.regenHpInterval(socket);
        }
    }
    [config.SERVER_INNER.GAIN_HP.name](data, socket) {
        let hp = data.hp;
        let gainedHp = this.controller.addHp(socket.character, hp);
        if (gainedHp) {
            socket.emit(this.CLIENT_GETS.GAIN_HP.name, {
                hp,
                now: socket.character.stats.hp.now
            });
        }
    }
    [config.SERVER_INNER.GAIN_MP.name](data, socket) {
        let mp = data.mp;
        let gainedMp = this.controller.addMp(socket.character, mp);
        if (gainedMp) {
            socket.emit(this.CLIENT_GETS.GAIN_MP.name, {
                mp,
                now: socket.character.stats.mp.now
            });
        }
    }
    [config.SERVER_GETS.RELEASE_DEATH.name](data, socket) {
        if (socket.alive) {
            this.sendError({}, socket, "Character is alive!");
            return;
        }
        socket.character.stats.hp.now = socket.character.stats.hp.total;
        socket.emit(this.CLIENT_GETS.RESURRECT.name, {});
        console.log("releasing death for", socket.character.name);
        this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
    }
    [config.SERVER_INNER.STATS_ADD.name](data, socket) {
        this.toggleStats(data.stats, socket, true);
    }
    [config.SERVER_INNER.STATS_REMOVE.name](data, socket) {
        this.toggleStats(data.stats, socket, false);
    }
    toggleStats(stats, socket, on) {
        for (var stat in items_model_1.ITEM_STATS_SCHEMA) {
            if (stats[stat]) {
                socket.bonusStats[stat] = socket.bonusStats[stat] + stats[stat] * (on ? 1 : -1);
            }
        }
    }
    onConnected(socket) {
        this.regenHpInterval(socket);
        this.regenMpInterval(socket);
        Object.defineProperty(socket, 'alive', { get: () => {
                return socket.character.stats.hp.now > 0;
            } });
        socket.bonusStats = {};
        for (var stat in items_model_1.ITEM_STATS_SCHEMA) {
            socket.bonusStats[stat] = 0;
        }
        for (var itemKey in equips_model_1.EQUIPS_SCHEMA) {
            this[config.SERVER_INNER.STATS_ADD.name]({ stats: socket.character.equips[itemKey] }, socket);
        }
    }
    regenHpInterval(socket) {
        if (socket.character.stats.hp.now < socket.character.stats.hp.total) {
            setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_HP.name, { hp: socket.character.stats.hp.regen }, socket);
                    this.regenHpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
    regenMpInterval(socket) {
        if (socket.character.stats.mp.now < socket.character.stats.mp.total) {
            setTimeout(() => {
                if (socket.connected && socket.alive) {
                    this.emitter.emit(config.SERVER_INNER.GAIN_MP.name, { mp: socket.character.stats.mp.regen }, socket);
                    this.regenMpInterval(socket);
                }
            }, config.REGEN_INTERVAL);
        }
    }
}
exports.default = StatsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9zdGF0cy9zdGF0cy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUdsRSxzREFBeUQ7QUFDekQseURBQXVEO0FBQ3ZELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3BFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXpFLGlCQUFpQyxTQUFRLDhCQUFrQjtJQUkxRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUUsSUFBSSxFQUFFLE1BQWtCO1FBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDeEMsR0FBRztZQUNILEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO1NBQ2pDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUN4QyxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO2dCQUN4QixLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLO2FBQ2hDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtnQkFDNUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztnQkFDeEIsS0FBSyxFQUFFO29CQUNILEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO2lCQUNsQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBRSxJQUFJLEVBQUUsTUFBa0I7UUFDekQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNuQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEYsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDdkksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7UUFDakQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ3RFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRztZQUNILEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRztTQUNqQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xGLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDaEUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRzthQUMzQixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSxJQUFJLEVBQUUsTUFBa0I7UUFDeEQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNqQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDdkMsRUFBRTtnQkFDRixHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUc7YUFDckMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7SUFFRCxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFFLElBQUksRUFBRSxNQUFrQjtRQUN4RCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2pCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUN2QyxFQUFFO2dCQUNGLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRzthQUNyQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUUsSUFBSSxFQUFFLE1BQWtCO1FBQzdELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBRSxJQUFJLEVBQUUsTUFBa0I7UUFDMUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBRSxJQUFJLEVBQUUsTUFBa0I7UUFDN0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQW9CLEVBQUUsTUFBa0IsRUFBRSxFQUFXO1FBQ3JFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLCtCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEYsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sV0FBVyxDQUFDLE1BQWtCO1FBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUU7Z0JBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM3QyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksK0JBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSw0QkFBYSxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGVBQWUsQ0FBQyxNQUFrQjtRQUN0QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLFVBQVUsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNyRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0wsQ0FBQztJQUNPLGVBQWUsQ0FBQyxNQUFrQjtRQUN0QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLFVBQVUsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNyRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBakpELDhCQWlKQztBQUFBLENBQUMifQ==