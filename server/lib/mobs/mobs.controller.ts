'use strict';
import MasterController from '../master/master.controller';
import MobsServices from './mobs.services';
import * as _ from 'underscore';
let CLIENT_GETS = require('../../../server/lib/mobs/mobs.config.json').CLIENT_GETS;

export default class MobsController extends MasterController {
	protected services: MobsServices;
	private roomsMobs: Map<string, ROOM_MOBS> = new Map();
	private mobById: Map<string, MOB_INSTANCE> = new Map();
	private io: SocketIO.Namespace;

	constructor() {
		super();
	}

	public setIo(io) {
		this.io = io;
	}

	// Socket functions
	// =================
	public hasRoom(room: string) {
		return this.roomsMobs.has(room);
	}

	public hasMob(id: string) {
		return this.mobById.has(id);
	}

	public startSpawningMobs(roomInfo: ROOM_SCHEMA) {
		let roomMobs: ROOM_MOBS = {
			spawns: []
		};
		roomInfo.spawns.forEach(spawnInfo => {
			let spawn: SPAWN_INSTANCE = Object.assign({}, spawnInfo);
			
			let mobsInSpawn: Map<string, MOB_INSTANCE> = new Map();
			this.spawnMobs(spawn, mobsInSpawn, roomInfo.name);
			spawn.mobs = mobsInSpawn;
			roomMobs.spawns.push(spawn);
		});
		this.roomsMobs.set(roomInfo.name, roomMobs);
	}

	protected spawnMobs(spawnInfo: SPAWN_INSTANCE, mobsInSpawn: Map<string, MOB_INSTANCE>, room: string) {
		let mobsToSpawn = spawnInfo.cap - mobsInSpawn.size;
		console.log("spawning %d mobs", mobsToSpawn);
		for (let i = 0; i < mobsToSpawn; i++) {
			let mob = this.spawnMob(spawnInfo, room);
			mob.spawn = spawnInfo; // useful for when we delete the mob
			mobsInSpawn.set(mob.id, mob);
		}
	}

	protected spawnMob(spawnInfo: SPAWN_INSTANCE, room: string): MOB_INSTANCE {
		let mob: MOB_INSTANCE = this.services.getMobInfo(spawnInfo.mobId);
		mob.id = _.uniqueId();
		mob.x = spawnInfo.x;
		mob.y = spawnInfo.y;

		this.mobById.set(mob.id, mob);
		this.notifyAboutMob(mob, this.io.to(room));
		return mob;
	}

	protected notifyAboutMob(mob: MOB_INSTANCE, to: SocketIO.Namespace|SocketIO.Socket) {
		to.emit(CLIENT_GETS.MOB_SPAWN, {
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

	public moveMob(id: string, x: number, y: number, socket: GameSocket) {
		let mob = this.mobById.get(id);
		mob.x = x;
		mob.y = y;
		socket.broadcast.to(socket.character.room).emit(CLIENT_GETS.MOB_MOVE, {
			mob_id: id, 
			x,
			y,
		});
	}

	public hurtMob(id: string, dmg: number): MOB_INSTANCE {
		let mob = this.mobById.get(id);
		mob.hp = Math.max(0, mob.hp - dmg);
		return mob;
	}

	public hurtChar(id: string, socket: GameSocket) {
		let mob = this.mobById.get(id);
		let dmg = _.random(mob.minDmg, mob.maxDmg);
		socket.character.stats.hp.now = Math.max(0, socket.character.stats.hp.now - dmg);
		this.io.to(socket.character.room).emit(CLIENT_GETS.TAKE_DMG, {
			id: socket.character._id,
			dmg,
			hp: socket.character.stats.hp.now
		});
		console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
	}

	public despawnMob(mob: MOB_INSTANCE, room: string) {
		console.log("despawning mob", mob.id);
		this.io.to(room).emit(CLIENT_GETS.MOB_DIE, {
			mob_id: mob.id,
		});
		// remove mob references
		mob.spawn.mobs.delete(mob.id);
		this.mobById.delete(mob.id);

		if (mob.spawn.cap == mob.spawn.mobs.size + 1) {
			// if it's the first mob that we kill, set a timer to respawn
			console.log("setting interval to respawn", mob.id);
			setInterval(() => {
				this.spawnMobs(mob.spawn, mob.spawn.mobs, room);
			}, mob.spawn.interval * 1000);
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