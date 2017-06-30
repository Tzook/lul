'use strict';
import SocketioRouterBase from "../socketio/socketio.router.base";
import MobsMiddleware from "./mobs.middleware";
import MobsController from "./mobs.controller";
import RoomsRouter from "../rooms/rooms.router";
import MobsServices from "./mobs.services";
import PartyRouter from "../party/party.router";
import config from "../mobs/mobs.config";
import statsConfig from "../stats/stats.config";
import dropsConfig from "../drops/drops.config";
import questsConfig from "../quests/quests.config";

export default class MobsRouter extends SocketioRouterBase {
	protected middleware: MobsMiddleware;
	protected controller: MobsController;
    protected services: MobsServices;
	protected roomsRouter: RoomsRouter;
    protected partyRouter: PartyRouter;
	
	init(files, app) {
		this.roomsRouter = files.routers.rooms;
        this.partyRouter = files.routers.party;
        this.services = files.services;
		super.init(files, app);
	}
	
	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateMobs.bind(this.controller));
	}

    public onConnected(socket: GameSocket) {
        socket.threats = new Set();
    }

	[config.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		if (!this.controller.hasRoom(socket.character.room)) {
			// we must spawn new mobs
			let roomInfo = this.roomsRouter.getRoomInfo(socket.character.room);
			if (roomInfo) {
				this.controller.startSpawningMobs(roomInfo);
			} else {
				this.sendError({charRoom: socket.character.room}, socket, "No room info! cannot spawn any mobs.");
			}
		} else {
			this.controller.notifyAboutMobs(socket);
		}
	}

	[config.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		for (let mob of socket.threats) {
            this.controller.removeThreat(mob, socket);
        }
        socket.threats.clear();
	}

	[config.SERVER_GETS.MOB_TAKE_DMG.name](data, socket: GameSocket) {
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

                let max = {dmg: 0, socket: null};
                let parties: Map<PARTY_MODEL | GameSocket, {exp: number, socket: GameSocket}> = new Map();
                for (let [charId, charDmg] of mob.dmgers) {
                    let charSocket = socket.map.get(charId);
                    if (charSocket && charSocket.character.room === socket.character.room && charSocket.alive) {
                        // found char and he's alive in our room
                        let exp = this.services.getExp(mob, charDmg);
                        let party = this.partyRouter.getCharParty(charSocket);
                        if (party) {
                            let currentPartyExp = (parties.get(party) || {exp: 0}).exp;
                            parties.set(party, {socket: charSocket, exp: currentPartyExp + exp});
                        } else {
				            this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, charSocket);
                        }

                        if (charDmg > max.dmg) {
                            max.dmg = charDmg;
                            max.socket = charSocket;
                        }
                    }
                }
                for (let [, {socket, exp}] of parties) {
                    let partySockets = this.partyRouter.getPartyMembersInMap(socket);
                    // split exp equally among party members
                    exp = Math.ceil(exp / partySockets.length);

                    for (let memberSocket of partySockets) {
                        this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, memberSocket);
                    }
                }

                this.emitter.emit(dropsConfig.SERVER_INNER.GENERATE_DROPS.name, {x: mob.x, y: mob.y, owner: max.socket.character.name}, max.socket, mob.drops);
                this.emitter.emit(questsConfig.SERVER_INNER.HUNT_MOB.name, {id: mob.mobId}, max.socket);
			}
		} else {
			this.sendError(data, socket, "Mob doesn't exist!");
		}
	}

	[config.SERVER_GETS.MOB_MOVE.name](data, socket: GameSocket) {
		if (!this.controller.hasMob(data.mob_id, socket)) {
			this.sendError(data, socket, "Mob doesn't exist!");
		} else {
			this.controller.moveMob(data.mob_id, data.x, data.y, socket);
		}
	}

	[config.SERVER_GETS.TAKE_DMG.name](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id, socket)) {
			let dmg = this.controller.getHurtCharDmg(data.mob_id, socket);
			this.emitter.emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { dmg }, socket);
		} else {
			this.sendError(data, socket, "Mob doesn't exist!");
		}
	}
};
