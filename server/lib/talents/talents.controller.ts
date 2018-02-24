import MasterController from '../master/master.controller';
import TalentsServices from './talents.services';
import MobsRouter from '../mobs/mobs.router';
import talentsConfig from '../talents/talents.config';
import mobsConfig from '../mobs/mobs.config';
import statsConfig from '../stats/stats.config';
import * as _ from 'underscore';
import combatConfig from '../combat/combat.config';

export default class TalentsController extends MasterController {
	protected services: TalentsServices;
	protected mobsRouter: MobsRouter;
	// room => mob => buff instance[]
	protected roomToBuff: Map<string, Map<string, Set<BUFF_INSTANCE>>> = new Map();
	protected mobsSpellsPickers: Map<string, Map<string, NodeJS.Timer>> = new Map();

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

	public applyHurtMobPerks(dmg: number, crit: boolean, mob: MOB_INSTANCE, socket: GameSocket) {
		this.tryToApplySocketPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, mob, socket);
		this.tryToApplySocketPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, mob, socket);
		this.tryToApplySocketPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, mob, socket, (buffInstace) => this.triggerMobBleed(dmg, crit, mob, buffInstace, socket));
		this.tryToApplySocketPerk(talentsConfig.PERKS.FREEZE_CHANCE, talentsConfig.PERKS.FREEZE_DURATION, mob, socket);
		this.tryToApplySocketPerk(talentsConfig.PERKS.BURN_CHANCE, talentsConfig.PERKS.BURN_DURATION, mob, socket, (buffInstace) => this.triggerMobBurn(dmg, crit, mob, buffInstace, socket));
	}
	
	public applyMobHurtPerks(dmg: number, crit: boolean, mob: MOB_INSTANCE, socket: GameSocket) {
		this.tryToApplyMobPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, mob, socket);
		this.tryToApplyMobPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, mob, socket);
		this.tryToApplyMobPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, mob, socket, (buffInstace) => this.triggerSocketBleed(dmg, crit, buffInstace, socket));
		this.tryToApplyMobPerk(talentsConfig.PERKS.FREEZE_CHANCE, talentsConfig.PERKS.FREEZE_DURATION, mob, socket);
		this.tryToApplyMobPerk(talentsConfig.PERKS.BURN_CHANCE, talentsConfig.PERKS.BURN_DURATION, mob, socket, (buffInstace) => this.triggerSocketBurn(dmg, crit, buffInstace, socket));
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
		const activated = this.services.isAbilityActivated(perkChanceName, mob);
		if (activated) {
			let duration = this.services.getAbilityPerkValue(perkDurationName, mob);
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
		socket.buffs.forEach(buffInstance => this.tellRemainingBuff(socket.broadcast.to(socket.character.room), buffInstance, socket.character._id));
		
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

	protected triggerMobBleed(dmg: number, crit: boolean, mob: MOB_INSTANCE, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickMobDmg(bleedDmg, crit, buffInstace, mob, socket.character.room, combatConfig.HIT_CAUSE.BLEED, talentsConfig.PERKS.BLEED_TICK_TIME, 0, socket);
	}

	protected triggerMobBurn(dmg: number, crit: boolean, mob: MOB_INSTANCE, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let burnDmg = this.services.getBurnDmg(dmg);
		this.tickMobDmg(burnDmg, crit, buffInstace, mob, socket.character.room, combatConfig.HIT_CAUSE.BURN, talentsConfig.PERKS.BURN_TICK_TIME, 0, socket);
	}

	protected tickMobDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, mob: MOB_INSTANCE, room: string, cause: string, interval: number, tickIndex: number, socket: GameSocket) {
		let buffTimer = setTimeout(() => {
			if (mob.hp <= 0 || !socket.connected || !socket.alive || socket.character.room !== room) {
				return this.clearBuff(room, mob.id, buffInstance);
			}
			this.mobsRouter.getEmitter().emit(mobsConfig.SERVER_INNER.MOB_TAKE_DMG.name, {
				mobId: mob.id, 
				dmg,
				cause,
				crit,
			}, socket);
			this.tickMobDmg(dmg, crit, buffInstance, mob, room, cause, interval, tickIndex + 1, socket);
		}, interval * 1000 - (tickIndex === 0 ? 100 : 0)); // reducing 200 ms so all the ticks will fit in the time
		buffInstance.onPerkCleared = () => clearTimeout(buffTimer);
	}

	protected triggerSocketBleed(dmg: number, crit: boolean, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickSocketDmg(bleedDmg, crit, buffInstace, combatConfig.HIT_CAUSE.BLEED, talentsConfig.PERKS.BLEED_TICK_TIME, 0, socket);
	}

	protected triggerSocketBurn(dmg: number, crit: boolean, buffInstace: BUFF_INSTANCE, socket: GameSocket) {
		let burnDmg = this.services.getBurnDmg(dmg);
		this.tickSocketDmg(burnDmg, crit, buffInstace, combatConfig.HIT_CAUSE.BURN, talentsConfig.PERKS.BURN_TICK_TIME, 0, socket);
	}

	protected tickSocketDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, cause: string, interval: number, tickIndex: number, socket: GameSocket) {
		let buffTimer = setTimeout(() => {
			this.mobsRouter.getEmitter().emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { 
				dmg,
				cause,
				crit
			}, socket);
			this.tickSocketDmg(dmg, crit, buffInstance, cause, interval, tickIndex + 1, socket);
		}, interval * 1000 - (tickIndex === 0 ? 100 : 0)); // reducing 200 ms so all the ticks will fit in the time
		buffInstance.onPerkCleared = () => clearTimeout(buffTimer);
	}

	protected isMobInBuff(room: string, mobId: string, buff: string): boolean {
		// TODO use a more efficient way to check buffs
		const roomBuffs = this.roomToBuff.get(room);
		if (roomBuffs) {
			const mobBuffs = roomBuffs.get(mobId);
			if (mobBuffs) {
				for (let buffInstace of mobBuffs) {
					if (buffInstace.perkName === buff) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public mobStartSpellsPicker(mob: MOB_INSTANCE, room: string) {
		let timersMap: Map<string, NodeJS.Timer> = new Map();
		
		for (let spellKey in mob.spells) {
			this.activateMobSpellTimer(room, mob, spellKey, timersMap);
		}

		this.mobsSpellsPickers.set(mob.id, timersMap);
	}

	private activateMobSpellTimer(room: string, mob: MOB_INSTANCE, spellKey: string, timersMap: Map<string, NodeJS.Timer>) {
		const {minTime, maxTime} = mob.spells[spellKey];
		const time = this.services.getMobSpellRestTime(minTime, maxTime);
		const timerId = setTimeout(() => {
			this.io.to(room).emit(talentsConfig.CLIENT_GETS.MOB_USE_SPELL.name, {
				mob_id: mob.id,
				spell_key: spellKey,
			});
			// recursively use the spell
			this.activateMobSpellTimer(room, mob, spellKey, timersMap);
		}, time);
		timersMap.set(spellKey, timerId);
	}

	public hasMobSpellsPicker(mob: MOB_INSTANCE): boolean {
		return this.mobsSpellsPickers.has(mob.id);
	}
	
	public mobStopSpellsPicker(mob: MOB_INSTANCE) {
		const timersMap = this.mobsSpellsPickers.get(mob.id);
		if (timersMap) {
			for (let [,timerId] of timersMap) {
				clearTimeout(timerId);
			}
			this.mobsSpellsPickers.delete(mob.id);
		}
	}

	protected getRoomBuffsInstance(room: string, createIfMissing: boolean = false) {
		let roomBuffs = this.roomToBuff.get(room);
		if (!roomBuffs) {
			roomBuffs = new Map();
			if (createIfMissing) {
				this.roomToBuff.set(room, roomBuffs);
			}
		}
		return roomBuffs;
	}

	protected getMobBuffsInstance(room: string, mob: MOB_INSTANCE) {
		let roomBuffs = this.getRoomBuffsInstance(room, true);
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