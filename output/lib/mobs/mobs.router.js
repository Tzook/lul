'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/mobs/mobs.config.json');
let statsConfig = require('../../../server/lib/stats/stats.config.json');
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let questsConfig = require('../../../server/lib/quests/quests.config.json');
class MobsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.roomsRouter = files.routers.rooms;
        this.partyRouter = files.routers.party;
        this.services = files.services;
        super.init(files, app);
    }
    initRoutes(app) {
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateMobs.bind(this.controller));
    }
    onConnected(socket) {
        socket.threats = new Set();
    }
    [config.SERVER_GETS.ENTERED_ROOM.name](data, socket) {
        if (!this.controller.hasRoom(socket.character.room)) {
            let roomInfo = this.roomsRouter.getRoomInfo(socket.character.room);
            if (roomInfo) {
                this.controller.startSpawningMobs(roomInfo);
            }
            else {
                this.sendError({ charRoom: socket.character.room }, socket, "No room info! cannot spawn any mobs.");
            }
        }
        else {
            this.controller.notifyAboutMobs(socket);
        }
    }
    [config.SERVER_INNER.LEFT_ROOM.name](data, socket) {
        for (let mob of socket.threats) {
            this.controller.removeThreat(mob, socket);
        }
        socket.threats.clear();
    }
    [config.SERVER_GETS.MOB_TAKE_DMG.name](data, socket) {
        if (this.controller.hasMob(data.mob_id, socket)) {
            let load = socket.lastAttackLoad || 0;
            let dmg = this.controller.calculateDamage(socket, load);
            let mob = this.controller.hurtMob(data.mob_id, dmg, socket);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.MOB_TAKE_DMG.name, {
                id: socket.character._id,
                mob_id: mob.id,
                dmg,
                load,
                hp: mob.hp,
            });
            if (mob.hp === 0) {
                this.controller.despawnMob(mob, socket);
                let max = { dmg: 0, socket: null };
                let parties = new Map();
                for (let [charId, charDmg] of mob.dmgers) {
                    let charSocket = socket.map.get(charId);
                    if (charSocket && charSocket.character.room === socket.character.room && charSocket.alive) {
                        let exp = this.services.getExp(mob, charDmg);
                        let party = this.partyRouter.getCharParty(charSocket);
                        if (party) {
                            let currentPartyExp = (parties.get(party) || { exp: 0 }).exp;
                            parties.set(party, { socket: charSocket, exp: currentPartyExp });
                        }
                        else {
                            this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, charSocket);
                        }
                        if (charDmg > max.dmg) {
                            max.dmg = charDmg;
                            max.socket = charSocket;
                        }
                    }
                }
                for (let [, { socket, exp }] of parties) {
                    let partySockets = this.partyRouter.getPartyMembersInMap(socket);
                    exp = Math.ceil(exp / partySockets.length);
                    for (let memberSocket of partySockets) {
                        this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, memberSocket);
                    }
                }
                this.emitter.emit(dropsConfig.SERVER_INNER.GENERATE_DROPS.name, { x: mob.x, y: mob.y, owner: max.socket.character.name }, max.socket, mob.drops);
                this.emitter.emit(questsConfig.SERVER_INNER.HUNT_MOB.name, { id: mob.mobId }, max.socket);
            }
        }
        else {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
    }
    [config.SERVER_GETS.MOB_MOVE.name](data, socket) {
        if (!this.controller.hasMob(data.mob_id, socket)) {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
        else {
            this.controller.moveMob(data.mob_id, data.x, data.y, socket);
        }
    }
    [config.SERVER_GETS.TAKE_DMG.name](data, socket) {
        if (this.controller.hasMob(data.mob_id, socket)) {
            let dmg = this.controller.getHurtCharDmg(data.mob_id, socket);
            this.emitter.emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { dmg }, socket);
        }
        else {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
    }
}
exports.default = MobsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vYnMvbW9icy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQU1sRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQztBQUNsRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUU1RSxnQkFBZ0MsU0FBUSw4QkFBa0I7SUFPekQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRVMsVUFBVSxDQUFDLEdBQUc7UUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVTLFdBQVcsQ0FBQyxNQUFrQjtRQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLElB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