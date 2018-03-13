import MasterController from '../master/master.controller';
import MobsServices, { getDamageRange } from './mobs.services';
import * as _ from 'underscore';
import config from '../mobs/mobs.config';
import MobsRouter from './mobs.router';

export default class MobsController extends MasterController {
	protected services: MobsServices;
	protected router: MobsRouter;
	private roomsMobs: Map<string, ROOM_MOBS> = new Map();
	private mobById: Map<string, MOB_INSTANCE> = new Map();

	init(files, app) {
        this.router = files.router;
		super.init(files, app);
	}

	// Socket functions
	// =================
	public hasRoom(room: string) {
		return this.roomsMobs.has(room);
	}

	public hasMob(mobId: string, socket: GameSocket): boolean {
		return this.mobById.has(this.services.getMobRoomId(socket.character.room, mobId));
	}

	public getMob(mobId: string, socket: GameSocket): MOB_INSTANCE|undefined {
		return this.mobById.get(this.services.getMobRoomId(socket.character.room, mobId));
	}

	public startSpawningMobs(roomInfo: ROOM_MODEL, room: string) {
		let roomMobs: ROOM_MOBS = {
			spawns: []
		};
		roomInfo.spawns.forEach(spawnInfo => {
			let spawn: SPAWN_INSTANCE = Object.assign({}, spawnInfo);
			
			let mobsInSpawn: Map<string, MOB_INSTANCE> = new Map();
			this.spawnMobs(spawn, mobsInSpawn, room);
			spawn.mobs = mobsInSpawn;
			roomMobs.spawns.push(spawn);
		});
		this.roomsMobs.set(room, roomMobs);
	}

	protected spawnMobs(spawnInfo: SPAWN_INSTANCE, mobsInSpawn: Map<string, MOB_INSTANCE>, room: string) {
		let mobsToSpawn = spawnInfo.cap - mobsInSpawn.size;
		if (mobsToSpawn > 0) {
			let mob = this.spawnMob(spawnInfo, room);
			mob.spawn = spawnInfo; // useful for when we delete the mob
			mobsInSpawn.set(mob.id, mob);
			
			if (mobsToSpawn > 1) {
				// we still have a mob to spawn - set an interval
				this.setRespawnTimer(mob, room);
			}
		}
	}

	protected spawnMob(spawnInfo: SPAWN_INSTANCE, room: string): MOB_INSTANCE {
		let mob: MOB_INSTANCE = this.services.getMobInfo(spawnInfo.mobId);
		mob.id = _.uniqueId("mob-");
		mob.x = spawnInfo.x;
		mob.y = spawnInfo.y;
        mob.dmgers = new Map();
        mob.threat = {
            top: "",
            map: new Map()
		};
		mob.dmged = 0;
		mob.room = room;

		this.mobById.set(this.services.getMobRoomId(room, mob.id), mob);
		this.notifyAboutMob(mob, this.io.to(room));
		return mob;
	}

	protected notifyAboutMob(mob: MOB_INSTANCE, to: SocketIO.Namespace|SocketIO.Socket) {
		to.emit(config.CLIENT_GETS.MOB_SPAWN.name, {
			mob_id: mob.id,
			x: mob.x,
			y: mob.y,
			key: mob.mobId,
			hp: mob.hp,
		});
	}

	public notifyAboutMobs(socket: GameSocket) {
		this.roomsMobs.get(socket.character.room).spawns.forEach(spawn => {
			spawn.mobs.forEach(mob => {
				this.notifyAboutMob(mob, socket);
			});
		});
	}

	public moveMob(mobId: string, x: number, y: number, socket: GameSocket) {
		let mob = this.getMob(mobId, socket);
		mob.x = x;
		mob.y = y;
		socket.broadcast.to(socket.character.room).emit(config.CLIENT_GETS.MOB_MOVE.name, {
			mob_id: mobId, 
			x,
			y,
		});
	}

	public hurtMob(mob: MOB_INSTANCE, dmg: number, socket: GameSocket) {
        let actualDmg = this.services.getDamageToHurt(mob.hp, dmg);
		mob.hp -= actualDmg;
        
        let charDmgSoFar = mob.dmgers.get(socket.character.name) || 0;
        mob.dmgers.set(socket.character.name, charDmgSoFar + actualDmg);
        mob.dmged += actualDmg;
        
        this.addThreat(mob, actualDmg, socket);
	}

    public addThreat(mob: MOB_INSTANCE, threat: number, socket: GameSocket) {
		threat *= socket.getThreatModifier();
        threat += mob.threat.map.get(socket.character.name) || 0;
        mob.threat.map.set(socket.character.name, threat);

		socket.threats.add(mob);
        if (!mob.threat.top || (mob.threat.top !== socket.character.name && threat > mob.threat.map.get(mob.threat.top))) {
			mob.threat.top = socket.character.name;
            this.aggroChanged(mob, socket.character._id);
        }
    }
	
    private aggroChanged(mob: MOB_INSTANCE, id?: string) {
		this.router.getEmitter().emit(config.SERVER_INNER.MOB_AGGRO_CHANGED.name, { 
			mob, 
			id,
		});	
    }

    public removeThreat(mob: MOB_INSTANCE, socket: GameSocket) {
        let maxSocket: GameSocket;
        let maxThreat = 0;
		mob.threat.map.delete(socket.character.name);
		// pick a new top threat
		if (mob.threat.top === socket.character.name) {
			for (let [char, threat] of mob.threat.map) {
				let charSocket = socket.map.get(char);
				if (threat > maxThreat) {
					[maxSocket, maxThreat] = [charSocket, threat];
				}
			}
			mob.threat.top = maxSocket ? maxSocket.character.name : undefined;
			this.aggroChanged(mob, maxSocket ? maxSocket.character._id : undefined)
		}
    }

	public getHurtCharDmg(mob: MOB_INSTANCE, socket: GameSocket): DMG_RESULT {
        let dmgModifierResult = socket.getDmgModifier(mob, socket);
        let maxDmg = mob.dmg * dmgModifierResult.dmg;
        let minDmg = maxDmg * socket.getMinDmgModifier(mob);
		let dmg = getDamageRange(minDmg, maxDmg);
		return {dmg, crit: dmgModifierResult.crit};
	}
	
	public applyDefenceModifier(dmg: number, socket: GameSocket, attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) {
        dmg = Math.max(0, dmg - socket.getDefenceBonus(target));
        dmg *= socket.getDefenceModifier(attacker, target);
		dmg = Math.ceil(dmg); // make sure we are always rounded
		return dmg;
	}

	public despawnMob(mob: MOB_INSTANCE, socket: GameSocket) {
		this.io.to(socket.character.room).emit(config.CLIENT_GETS.MOB_DIE.name, {
			mob_id: mob.id,
		});
		// remove mob references
		for (let [char,] of mob.threat.map) {
			socket.map.get(char).threats.delete(mob);
		}
		mob.spawn.mobs.delete(mob.id);
		this.mobById.delete(this.services.getMobRoomId(socket.character.room, mob.id));

		if (mob.spawn.cap == mob.spawn.mobs.size + 1) {
			// if it's the first mob that we kill, set a timer to respawn
			this.setRespawnTimer(mob, socket.character.room);
		}
	}

	protected setRespawnTimer(mob: MOB_INSTANCE, room: string) {
		if (mob.spawn.interval >= 0) {
			setTimeout(() => {
				this.spawnMobs(mob.spawn, mob.spawn.mobs, room);
			}, mob.spawn.interval * 1000);
		}
	}

	public didHitMob(mobId: string, socket: GameSocket) {
		let mob = this.getMob(mobId, socket);
		return this.services.didHitMob(mob.lvl, socket.character.stats.lvl);
	}

	public clearRoom(socket: GameSocket) {
		const emitter = this.router.getEmitter();
		// despawn all mobs
		let map = this.roomsMobs.get(socket.character.room);
		if (map) {
			map.spawns.forEach(spawn => {
				spawn.interval = -1; // make sure respawn doesn't occur
				spawn.mobs.forEach(mob => {
					emitter.emit(config.SERVER_INNER.MOB_DESPAWN.name, { mob }, socket);	
				});
			});
			this.roomsMobs.delete(socket.character.room);
		}
	}

	// HTTP functions
	// =================
	public generateMobs(req, res, next) {
        this.services.generateMobs(req.body.mobs)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_MOB, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateMobs", file: "mobs.controller.js"});
			});
    }

	public warmMobsInfo(): void {
		this.services.getMobs()
			.catch(e => {
				console.error("Had an error getting mobs from the db!");
				throw e;
			});
	}
};