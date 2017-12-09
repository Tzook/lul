import MasterController from '../master/master.controller';
import TalentsServices from './talents.services';
import MobsRouter from '../mobs/mobs.router';
import talentsConfig from '../talents/talents.config';
import mobsConfig from '../mobs/mobs.config';
import statsConfig from '../stats/stats.config';
import * as _ from 'underscore';

export default class TalentsController extends MasterController {
	protected services: TalentsServices;
	protected mobsRouter: MobsRouter;
	// room => mob => buff instance[]
	protected roomToBuff: Map<string, Map<string, Set<BUFF_INSTANCE>>> = new Map();
	// room -> mob -> timer
	protected mobsSpellsPickers: Map<string, Map<MOB_INSTANCE, NodeJS.Timer>> = new Map();
	protected pausedSpellsPickersRooms: Set<string> = new Set();

	init(files, app) {
		this.mobsRouter = files.routers.mobs;
		super.init(files, app);
	}

	public applySelfPerks(dmg: number, socket: GameSocket) {
		const lifeSteal = this.services.getAbilityPerkValue(talentsConfig.PERKS.LIFE_STEAL_KEY, socket);
		const hp = this.services.getStealValue(dmg, lifeSteal);
		if (hp > 0) {
			this.mobsRouter.getEmitter().emit(statsConfig.SERVER_INNER.GAIN_HP.name, { hp }, socket);
		}
		const manaSteal = this.services.getAbilityPerkValue(talentsConfig.PERKS.MANA_STEAL_KEY, socket);
		const mp = this.services.getStealValue(dmg, manaSteal);
		if (mp > 0) {
			this.mobsRouter.getEmitter().emit(statsConfig.SERVER_INNER.GAIN_MP.name, { mp }, socket);
		}
	}

	public applyHurtMobPerks(dmg: number, mob: MOB_INSTANCE, socket: GameSocket) {
		this.tryToApplySocketPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, mob, socket);
		this.tryToApplySocketPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, mob, socket);
		this.tryToApplySocketPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, mob, socket, (buffInstace) => this.triggerMobBleed(dmg, mob, buffInstace, socket));
	}
	
	public applyMobHurtPerks(dmg: number, mob: MOB_INSTANCE, socket: GameSocket) {
		this.tryToApplyMobPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, mob, socket);
		this.tryToApplyMobPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, mob, socket);
		this.tryToApplyMobPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, mob, socket, (buffInstace) => this.triggerSocketBleed(dmg, buffInstace, socket));
	}
	
	public tryToApplySocketPerk(perkChanceName: string, perkDurationName: string, mob: MOB_INSTANCE, socket: GameSocket, onPerkActivated = (buffInstace: BUFF_INSTANCE) => {}) {
		const activated = this.services.isAbilityActivated(perkChanceName, socket);
		if (activated) {
			const room = socket.character.room;
			let mobBuffs = this.getMobBuffsInstance(room, mob);
			let duration = this.services.getAbilityPerkValue(perkDurationName, socket);
			this.io.to(socket.character.room).emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
				target_id: mob.id,
				key: perkChanceName,
				duration,
			});
			let clearTimeoutId = setTimeout(() => this.clearBuff(room, mob.id, buffInstace), duration * 1000);
			var buffInstace = {
				clearTimeoutId,
				perkName: perkChanceName,
				duration,
				initTime: Date.now(),
			};
			mobBuffs.add(buffInstace);
			onPerkActivated(buffInstace);
		}
	}
	
	public tryToApplyMobPerk(perkChanceName: string, perkDurationName: string, mob: MOB_INSTANCE, socket: GameSocket, onPerkActivated = (buffInstace: BUFF_INSTANCE) => {}) {
		const activated = this.services.isMobPerkActivated(perkChanceName, mob);
		if (activated) {
			let duration = this.services.getMobPerkValue(perkDurationName, mob);
			this.io.to(socket.character.room).emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
				target_id: socket.character._id,
				key: perkChanceName,
				duration,
			});
			let clearTimeoutId = setTimeout(() => this.clearSocketBuff(socket, buffInstace), duration * 1000);
			var buffInstace = {
				clearTimeoutId,
				perkName: perkChanceName,
				duration,
				initTime: Date.now(),
			};
			socket.buffs.add(buffInstace);
			onPerkActivated(buffInstace);
		}
	}

	public notifyAboutBuffs(socket: GameSocket) {
		let roomMap = this.getRoomBuffsInstance(socket.character.room);
		for (let [mobId, mobBuffs] of roomMap) {
			let hasMob = this.mobsRouter.hasMob(mobId, socket);
			for (let buffInstance of mobBuffs) {
				if (hasMob) {
					this.tellRemainingBuff(socket, buffInstance, mobId);
				} else {
					this.clearBuff(socket.character.room, mobId, buffInstance);
				}
			}
		}
		
		// tell the room about the current buffs the user has
		let broadcast = socket.broadcast.to(socket.character.room);
		socket.buffs.forEach(buffInstance => this.tellRemainingBuff(broadcast, buffInstance, socket.character._id));
		
		// tell the user about the current socket room buffs
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				let otherSocket = socket.map.get(socketId);
				otherSocket.buffs.forEach(buffInstance => this.tellRemainingBuff(socket, buffInstance, socketId));
			});
		}
	}
	
	protected tellRemainingBuff(to: {emit: Function}, buffInstance: BUFF_INSTANCE, targetId: string): void {
		const secondsPassed = (Date.now() - buffInstance.initTime) / 1000;
		const duration = (buffInstance.duration - secondsPassed).toFixed(2);
		to.emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
			target_id: targetId,
			key: buffInstance.perkName,
			duration,
		});
	}

	protected clearBuff(room: string, mobId: string, buffInstance: BUFF_INSTANCE) {
		let roomMap = this.roomToBuff.get(room);
		let mobsBuff = roomMap.get(mobId);
		clearTimeout(buffInstance.clearTimeoutId);
		buffInstance.onPerkCleared && buffInstance.onPerkCleared();
		mobsBuff.delete(buffInstance);
		if (mobsBuff.size === 0) {
			roomMap.delete(mobId);
		}
		if (roomMap.size === 0) {
			this.roomToBuff.delete(room);
		}
	} 
	
	protected clearSocketBuff(socket: GameSocket, buffInstance: BUFF_INSTANCE): void {
		clearTimeout(buffInstance.clearTimeoutId);
		buffInstance.onPerkCleared && buffInstance.onPerkCleared();
		socket.buffs.delete(buffInstance);
	}

	public clearSocketBuffs(socket: GameSocket): void {
		socket.buffs.forEach(buffInstance => this.clearSocketBuff(socket, buffInstance));
	}

	protected triggerMobBleed(dmg: number, mob: MOB_INSTANCE, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickMobBleed(bleedDmg, buffInstace, mob, socket.character.room, 0, socket);
	}

	protected tickMobBleed(dmg: number, bleedBuff: BUFF_INSTANCE, mob: MOB_INSTANCE, room: string, tickIndex: number, socket: GameSocket) {
		let crit = socket.isCrit;
		let bleedTimer = setTimeout(() => {
			if (mob.hp <= 0 || !socket.connected || !socket.alive || socket.character.room !== room) {
				return this.clearBuff(room, mob.id, bleedBuff);
			}
			this.mobsRouter.getEmitter().emit(mobsConfig.SERVER_INNER.MOB_TAKE_DMG.name, {
				mobId: mob.id, 
				dmg,
				cause: talentsConfig.PERKS.BLEED_DMG_CAUSE,
				crit,
			}, socket);
			this.tickMobBleed(dmg, bleedBuff, mob, room, tickIndex + 1, socket);
		}, talentsConfig.PERKS.BLEED_TICK_TIME * 1000 - (tickIndex === 0 ? 200 : 0)); // reducing 200 ms so all the ticks will fit in the time
		bleedBuff.onPerkCleared = () => clearTimeout(bleedTimer);
	}

	protected triggerSocketBleed(dmg: number, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickSocketBleed(bleedDmg, buffInstace, 0, socket);
	}

	protected tickSocketBleed(dmg: number, bleedBuff: BUFF_INSTANCE, tickIndex: number, socket: GameSocket) {
		let bleedTimer = setTimeout(() => {
			this.mobsRouter.getEmitter().emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { 
				dmg,
				cause: talentsConfig.PERKS.BLEED_DMG_CAUSE,
			}, socket);
			this.tickSocketBleed(dmg, bleedBuff, tickIndex + 1, socket);
		}, talentsConfig.PERKS.BLEED_TICK_TIME * 1000 - (tickIndex === 0 ? 200 : 0)); // reducing 200 ms so all the ticks will fit in the time
		bleedBuff.onPerkCleared = () => clearTimeout(bleedTimer);
	}

	public mobStartSpellsPicker(mob: MOB_INSTANCE, room: string, isRoomEmpty: boolean) {
		const timerId = this.mobSpellsPickerTimer(mob, room);
		if (isRoomEmpty) {
			// room is empty - so we don't want the spell to actually trigger
			clearTimeout(timerId);
		}
	}

	public mobSpellsPickerTimer(mob: MOB_INSTANCE, room: string): NodeJS.Timer {
		const time = this.services.getMobSpellRestTime();
		const timerId = setTimeout(() => {
			const spellKey = this.services.getMobSpellUsed(mob);

			this.io.to(room).emit(talentsConfig.CLIENT_GETS.USE_SPELL.name, {
				activator_id: mob.id,
				spell_key: spellKey,
			});

			// recursively pick another spell
			this.mobSpellsPickerTimer(mob, room);
		}, time);

		let roomSpellsPickers = this.mobsSpellsPickers.get(room) || this.mobsSpellsPickers.set(room, new Map()).get(room);

		roomSpellsPickers.set(mob, timerId);
		return timerId
	}
	
	public mobStopSpellsPicker(mob: MOB_INSTANCE, room: string) {
		let roomSpellsPickers = this.mobsSpellsPickers.get(room);
		const timerId = roomSpellsPickers.get(mob);
		clearTimeout(timerId);
		roomSpellsPickers.delete(mob);
		// clear room object if it has no more mobs
		if (roomSpellsPickers.size === 0) {
			this.mobsSpellsPickers.delete(room);
		}
	}
	
	public pauseMobsSpellsPickers(room) {
		let roomSpellsPickers = this.mobsSpellsPickers.get(room);
		if (roomSpellsPickers) {
			for (let [, timerId] of roomSpellsPickers) {
				clearTimeout(timerId);	
			}
			this.pausedSpellsPickersRooms.add(room);
		}
	}

	public isMobsSpellsPickersPaused(room): boolean {
		return this.pausedSpellsPickersRooms.has(room);
	}
	
	public continueMobsSpellsPickers(room) {
		this.pausedSpellsPickersRooms.delete(room);
		let roomSpellsPickers = this.mobsSpellsPickers.get(room);
		for (let [mob, ] of roomSpellsPickers) {
			this.mobSpellsPickerTimer(mob, room);
		}
	}

	protected getRoomBuffsInstance(room: string) {
		let roomBuffs = this.roomToBuff.get(room);
		if (!roomBuffs) {
			roomBuffs = new Map();
			this.roomToBuff.set(room, roomBuffs);
		}
		return roomBuffs;
	}

	protected getMobBuffsInstance(room: string, mob: MOB_INSTANCE) {
		let roomBuffs = this.getRoomBuffsInstance(room);
		let mobBuffs = roomBuffs.get(mob.id);
		if (!mobBuffs) {
			mobBuffs = new Set();
			roomBuffs.set(mob.id, mobBuffs);
		}
		return mobBuffs;
	}

    // HTTP functions
	// =================
	public generateTalents(req, res, next) {
        this.services.generateTalents(req.body.talents, req.body.perkCollection)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_TALENTS, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateTalents", file: "talents.controller.js"});
			});
    }

	public warmTalentsInfo(): void {
		this.services.getTalents()
			.catch(e => {
				console.error("Had an error getting talents from the db!");
				throw e;
			});
	}
};