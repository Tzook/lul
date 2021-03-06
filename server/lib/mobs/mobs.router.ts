
import SocketioRouterBase from '../socketio/socketio.router.base';
import MobsMiddleware from './mobs.middleware';
import MobsController, { getMob } from './mobs.controller';
import RoomsRouter from '../rooms/rooms.router';
import MobsServices, { getPartyShareExp, setMobsExtraDropsAfter2, getMobExtraDrops, shouldMobHaveExtraDrops, addThreat } from './mobs.services';
import config from '../mobs/mobs.config';
import statsConfig from '../stats/stats.config';
import dropsConfig from '../drops/drops.config';
import questsConfig from '../quests/quests.config';
import combatConfig from '../combat/combat.config';
import CombatRouter from '../combat/combat.router';
import { isInInstance, getRoomName } from '../rooms/rooms.services';
import { getMobDeadOrAlive } from './mobs.controller';
import mobsConfig from '../mobs/mobs.config';
import { getPartyMembersInMap, getCharParty } from '../party/party.services';
import { isMob, isSocket, getId } from '../talents/talents.services';

export default class MobsRouter extends SocketioRouterBase {
	protected middleware: MobsMiddleware;
	protected controller: MobsController;
    protected services: MobsServices;
	protected roomsRouter: RoomsRouter;
	protected combatRouter: CombatRouter;
	
	init(files, app) {
		this.roomsRouter = files.routers.rooms;
        this.combatRouter = files.routers.combat;
        this.services = files.services;
		super.init(files, app);
	}
	
	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.isBoss.bind(this.middleware),
			this.controller.generateMobs.bind(this.controller));
	}

    public onConnected(socket: GameSocket) {
		socket.threats = new Set();
	}
	
    [config.GLOBAL_EVENTS.GLOBAL_ITEMS_READY.name]() {
		setMobsExtraDropsAfter2();
    }
	
    [config.GLOBAL_EVENTS.GLOBAL_MOBS_READY.name]() {
		setMobsExtraDropsAfter2();
    }

	[config.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		if (!this.controller.hasRoom(socket.character.room)) {
			// we must spawn new mobs
			let roomInfo = this.roomsRouter.getRoomInfo(getRoomName(socket));
			if (roomInfo) {
				this.controller.startSpawningMobs(roomInfo, socket.character.room);
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
		let peopleLeftInRoom = socket.adapter.rooms[socket.character.room];
		if (isInInstance(socket) && !peopleLeftInRoom) {
			this.controller.clearRoom(socket);
		}
	}

	[config.SERVER_INNER.MISS_MOB.name](data: {mob: MOB_INSTANCE, cause: string}, socket: GameSocket) {
		let {mob, cause} = data;
		this.controller.addThreat(mob, 1, socket);
		this.io.to(socket.character.room).emit(config.CLIENT_GETS.MOB_TAKE_MISS.name, {
			id: socket.character._id,
			mob_id: mob.id,
			cause
		});
	}
	
	[config.SERVER_INNER.TARGET_BLOCKS.name](data: {attacker: PLAYER, target: PLAYER}, socket: GameSocket): any {
		let {target, attacker} = data;
		if (isMob(target)) {
			addThreat(target, 1, attacker);			
			this.io.to(socket.character.room).emit(config.CLIENT_GETS.MOB_ATTACK_BLOCK.name, {
				mob_id: target.id,
				hp: target.hp,
				id: getId(attacker)
			});
		}
	}
	
	[config.SERVER_INNER.HURT_TARGET.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket): any {
		let {target, attacker, dmg} = data;
		if (isMob(target) && isSocket(attacker)) {
			this.controller.hurtMob(target, dmg, attacker);
		}
	}
	
	[config.SERVER_INNER.DMG_DEALT.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket) {
		const {target} = data;
		if (isMob(target) && target.hp === 0) {
			this.emitter.emit(config.SERVER_INNER.MOB_DESPAWN.name, { mob: target }, socket);	

			let max = {dmg: 0, socket: null};
			let parties: Map<PARTY_MODEL | GameSocket, {exp: number, partySocketOwner: GameSocket}> = new Map();
			for (let [charId, charDmg] of target.dmgers) {
				let charSocket = socket.map.get(charId);
				if (charSocket && charSocket.character.room === socket.character.room && charSocket.alive) {
					// found char and he's alive in our room
					let exp = this.services.getExp(target, charDmg);
					let party = getCharParty(charSocket);
					if (party) {
						let currentPartyExp = (parties.get(party) || {exp: 0}).exp;
						parties.set(party, {partySocketOwner: charSocket, exp: currentPartyExp + exp});
					} else {
						this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, charSocket);
					}
		
					if (charDmg > max.dmg) {
						max.dmg = charDmg;
						max.socket = charSocket;
					}
				}
			}
			for (let [, {partySocketOwner, exp}] of parties) {
				let partySockets = getPartyMembersInMap(partySocketOwner);
				// split exp equally among party members
				exp = getPartyShareExp(exp, partySockets);
		
				for (let memberSocket of partySockets) {
					this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, memberSocket);
				}
			}
		
			let drops = target.drops;
			if (shouldMobHaveExtraDrops(target)) {
				drops = drops.concat(getMobExtraDrops(target.lvl));
			}
			this.emitter.emit(dropsConfig.SERVER_INNER.GENERATE_DROPS.name, {x: target.x, y: target.y, owner: max.socket.character.name}, max.socket, drops);
			this.emitter.emit(questsConfig.SERVER_INNER.HUNT_MOB.name, {id: target.mobId}, max.socket);
		}
	}

	[config.SERVER_GETS.MOBS_MOVE.name](data, socket: GameSocket) {
        (data.mobs || []).forEach(mob => {
            if (!this.controller.getMob(mob.mob_id, socket)) {
				// ignore it for now. The client keeps sending it right after a mob dies because it doesn't know it's dead yet
                // this.sendError(mob, socket, "Mob doesn't exist!");
            } else {
				this.controller.moveMob(mob.mob_id, mob.x, mob.y, socket);
				socket.broadcast.to(socket.character.room).emit(mobsConfig.CLIENT_GETS.MOB_MOVE.name, {
					mob_id: mob.mob_id, 
					x: mob.x,
					y: mob.y,
					velocity: mob.velocity
				});
            }
        });
	}

	[config.SERVER_GETS.PLAYER_TAKE_DMG.name](data, socket: GameSocket) {
		let mob = getMobDeadOrAlive(data.mob_id, socket);
		if (!mob) {
			return this.sendError(data, socket, "Mob doesn't exist!");
		}
		this.emitter.emit(combatConfig.SERVER_INNER.ATK_TARGETS.name, {attacker: mob, target_ids: [socket.character.name]}, socket);		
    }
	
	[config.SERVER_GETS.MOB_AGGRO_INIT.name](data: {mob_id: string, char_id: string}, socket: GameSocket) {
		let {char_id, mob_id} = data;
		const mob = getMob(mob_id, socket);
		if (!mob) {
			return this.sendError(data, socket, "Mob doesn't exist!");
		}
		const matchingChar = socket.map.get(char_id);
		if (!matchingChar || !matchingChar.alive || matchingChar.character.room !== socket.character.room) {
			return this.sendError(data, socket, "Aggro target must be alive in the same room");
		}
		if (mob.threat.top) {
			return this.sendError(data, socket, "Someone already aggros this mob");
		}
		this.emitter.emit(config.SERVER_INNER.MOB_AGGRO_CHANGED.name, {
			mob,
			id: char_id,
		}, socket);
	}

	[config.SERVER_INNER.MOB_AGGRO_CHANGED.name](data: {mob: MOB_INSTANCE, id?: string}) {
		let {id, mob} = data;			
		this.io.to(mob.room).emit(config.CLIENT_GETS.AGGRO.name, {
			id,
            mob_id: mob.id,
		});
	}
	
	[config.SERVER_INNER.MOB_DESPAWN.name](data, socket: GameSocket) {
		let {mob} = data;
		process.nextTick(() => this.controller.despawnMob(mob, socket));
	}
};
