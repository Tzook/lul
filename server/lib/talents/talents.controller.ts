import MasterController from '../master/master.controller';
import TalentsServices, { getRoom, getId, isSocket, removeBonusPerks, addBonusPerks } from './talents.services';
import MobsRouter from '../mobs/mobs.router';
import talentsConfig from '../talents/talents.config';
import mobsConfig from '../mobs/mobs.config';
import statsConfig from '../stats/stats.config';
import * as _ from 'underscore';
import combatConfig from '../combat/combat.config';

export default class TalentsController extends MasterController {
	protected services: TalentsServices;
	protected mobsRouter: MobsRouter;
	// room => mob => perk name => buff instance[]
	protected roomToBuff: Map<string, Map<string, Map<string, Set<BUFF_INSTANCE>>>> = new Map();
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

	public applyHurtPerks(dmg: number, crit: boolean, attacker: PLAYER, target: PLAYER) {
		this.tryToApplyPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, talentsConfig.PERKS.STUN_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, talentsConfig.PERKS.CRIPPLE_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, talentsConfig.PERKS.BLEED_RESISTANCE, attacker, target, (buffInstace) => this.triggerBleed(dmg, crit, buffInstace, attacker, target));
		this.tryToApplyPerk(talentsConfig.PERKS.FREEZE_CHANCE, talentsConfig.PERKS.FREEZE_DURATION, talentsConfig.PERKS.FREEZE_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.BURN_CHANCE, talentsConfig.PERKS.BURN_DURATION, talentsConfig.PERKS.BURN_RESISTANCE, attacker, target, (buffInstace) => this.triggerBurn(dmg, crit, buffInstace, attacker, target));
		
		let buffPerks = this.services.getBuffPerks();
		for (let [perkChanceName, perkDurationName] of buffPerks) {
			this.tryToApplyPerk(perkChanceName, perkDurationName, null, attacker, attacker, (buffInstace) => this.addBuffBonusPerks(attacker, perkChanceName), () => this.removeBuffBonusPerks(attacker, perkChanceName));
		}
	}

	public tryToApplyPerk(perkChanceName: string, perkDurationName: string, perkResistanceName: string, attacker: PLAYER, target: PLAYER, onPerkActivated = (buffInstace: BUFF_INSTANCE) => {}, onPerkCleared = () => {}) {
		let activated = this.services.isAbilityActivated(perkChanceName, attacker);	
		if (activated) {
			const resistanceActivated = perkResistanceName && this.services.isAbilityActivated(perkResistanceName, target);
			if (resistanceActivated) {
				activated = false;
				this.io.to(getRoom(target)).emit(talentsConfig.CLIENT_GETS.RESISTED_BUFF.name, {
					target_id: getId(target),
					key: perkResistanceName,
				});
			}
		}
		if (activated) {
			let duration = this.services.getAbilityPerkValue(perkDurationName, attacker);
			this.io.to(getRoom(target)).emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
				target_id: getId(target),
				key: perkChanceName,
				duration,
			});

			let clearTimeoutId = setTimeout(() => this.clearBuff(target, buffInstace), duration * 1000);
			var buffInstace = {
				clearTimeoutId,
				perkName: perkChanceName,
				duration,
				onPerkCleared,
				initTime: Date.now(),
			};
			this.addBuff(target, buffInstace);
			onPerkActivated(buffInstace);
		}
	}

	protected clearBuff(target: PLAYER, buffInstace: BUFF_INSTANCE) {
		return isSocket(target) 
			? this.clearSocketBuff(<GameSocket>target, buffInstace)
			: this.clearMobBuff((<MOB_INSTANCE>target).room, (<MOB_INSTANCE>target).id, buffInstace);
		}
		
	protected addBuff(target: PLAYER, buffInstace: BUFF_INSTANCE) {
		let buffs = isSocket(target) 
			? this.getSocketPerkBuffs(<GameSocket>target, buffInstace.perkName, true)
			: this.getMobPerkBuffs(<MOB_INSTANCE>target, buffInstace.perkName, true);
		buffs.add(buffInstace);
	}

	public notifyAboutBuffs(socket: GameSocket) {
		let roomMap = this.getRoomBuffsInstance(socket.character.room);
		for (let [mobId, mobBuffs] of roomMap) {
			for (let [,perkBuffs] of mobBuffs) {
				for (let buffInstance of perkBuffs) {
					this.tellRemainingBuff(socket, buffInstance, mobId);
				}
			}
		}
		
		// tell the room about the current buffs the user has
		socket.buffs.forEach(perkBuffs => perkBuffs.forEach(buffInstance => this.tellRemainingBuff(socket.broadcast.to(socket.character.room), buffInstance, socket.character._id)));
		
		// tell the user about the current socket room buffs
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				let otherSocket = socket.map.get(socketId);
				otherSocket.buffs.forEach(perkBuffs => perkBuffs.forEach(buffInstance => this.tellRemainingBuff(socket, buffInstance, socketId)));
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

	protected clearMobBuff(room: string, mobId: string, buffInstance: BUFF_INSTANCE) {
		clearTimeout(buffInstance.clearTimeoutId);
		
		let roomMap = this.getRoomBuffsInstance(room);
		let mobsBuff = this.getMobBuffsInstance(room, mobId);
		
		let perkBuffs = mobsBuff.get(buffInstance.perkName);
		perkBuffs.delete(buffInstance);
		if (perkBuffs.size === 0) {
			mobsBuff.delete(buffInstance.perkName);
		}
		
		if (mobsBuff.size === 0) {
			roomMap.delete(mobId);
		}
		if (roomMap.size === 0) {
			this.roomToBuff.delete(room);
		}
		buffInstance.onPerkCleared();
	} 
	
	public clearMobBuffs(room: string, mobId: string) {
		let mobsBuff = this.getMobBuffsInstance(room, mobId);
		for (let [,perkBuffs] of mobsBuff) {
			for (let buffInstance of perkBuffs) {
				this.clearMobBuff(room, mobId, buffInstance);
			}
		}
	}
	
	protected clearSocketBuff(socket: GameSocket, buffInstance: BUFF_INSTANCE): void {
		clearTimeout(buffInstance.clearTimeoutId);
		let perkBuffs = this.getSocketPerkBuffs(socket, buffInstance.perkName);
		perkBuffs.delete(buffInstance);
		if (perkBuffs.size === 0) {
			socket.buffs.delete(buffInstance.perkName);
		}
		buffInstance.onPerkCleared();
	}
	
	public clearSocketBuffs(socket: GameSocket): void {
		socket.buffs.forEach(perkBuffs => perkBuffs.forEach(buffInstance => this.clearSocketBuff(socket, buffInstance)));
	}

	protected getPerkBuffs(target: PLAYER, perkName: string, createIfMissing: boolean = false) {
		return isSocket(target) 
			? this.getSocketPerkBuffs(<GameSocket>target, perkName, createIfMissing)
			: this.getMobPerkBuffs(<MOB_INSTANCE>target, perkName, createIfMissing);
	}
	
	protected getSocketPerkBuffs(socket: GameSocket, perkName: string, createIfMissing: boolean = false) {
		let perkBuffs = socket.buffs.get(perkName);
		if (!perkBuffs) {
			perkBuffs = new Set();
			if (createIfMissing) {
				socket.buffs.set(perkName, perkBuffs);
			}
		}
		return perkBuffs;
	}

	protected getMobPerkBuffs(mob: MOB_INSTANCE, perkName: string, createIfMissing: boolean = false) {
		let mobBuffs = this.getMobBuffsInstance(mob.room, mob.id, createIfMissing);
		let perkBuffs = mobBuffs.get(perkName);
		if (!perkBuffs) {
			perkBuffs = new Set();
			if (createIfMissing) {
				mobBuffs.set(perkName, perkBuffs);
			}
		}
		return perkBuffs;
	}

	protected triggerBleed(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, attacker: PLAYER, target: PLAYER) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickDmg(bleedDmg, crit, buffInstance, combatConfig.HIT_CAUSE.BLEED, talentsConfig.PERKS_INFO.BLEED_TICK_TIME, attacker, target);
	}

	protected triggerBurn(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, attacker: PLAYER, target: PLAYER) {
		let burnDmg = this.services.getBurnDmg(dmg);
		this.tickDmg(burnDmg, crit, buffInstance, combatConfig.HIT_CAUSE.BURN, talentsConfig.PERKS_INFO.BURN_TICK_TIME, attacker, target);
	}

	protected tickDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, cause: string, interval: number, attacker: PLAYER, target: PLAYER) {
		isSocket(target) 
			? this.tickSocketDmg(dmg, crit, buffInstance, cause, interval, 0, <GameSocket>target)
			: this.tickMobDmg(dmg, crit, buffInstance, <MOB_INSTANCE>target, cause, interval, 0, <GameSocket>attacker);
	}

	protected tickMobDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, mob: MOB_INSTANCE, cause: string, interval: number, tickIndex: number, socket: GameSocket) {
		let buffTimer = setTimeout(() => {
			if (!socket.connected || !socket.alive || socket.character.room !== mob.room) {
				return this.clearMobBuff(mob.room, mob.id, buffInstance);
			}
			this.tickMobDmg(dmg, crit, buffInstance, mob, cause, interval, tickIndex + 1, socket);
			this.mobsRouter.getEmitter().emit(mobsConfig.SERVER_INNER.MOB_TAKE_DMG.name, {
				mobId: mob.id, 
				dmg,
				cause,
				crit,
			}, socket);
		}, interval * 1000 - (tickIndex === 0 ? 100 : 0)); // reducing 100 ms so all the ticks will fit in the time
		
		buffInstance.onPerkCleared = () => clearTimeout(buffTimer);
	}

	protected tickSocketDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, cause: string, interval: number, tickIndex: number, socket: GameSocket) {
		let buffTimer = setTimeout(() => {
			this.tickSocketDmg(dmg, crit, buffInstance, cause, interval, tickIndex + 1, socket);
			this.mobsRouter.getEmitter().emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { 
				dmg,
				cause,
				crit
			}, socket);
		}, interval * 1000 - (tickIndex === 0 ? 100 : 0)); // reducing 200 ms so all the ticks will fit in the time
		buffInstance.onPerkCleared = () => clearTimeout(buffTimer);
	}

	protected addBuffBonusPerks(target: PLAYER, perkName: string) {
		let perkBuffs = this.getPerkBuffs(target, perkName);
		if (perkBuffs.size === 1) {
			// todo apply the diff
			addBonusPerks({perks: this.services.getBonusPerks(perkName)}, target);
		}
	}
	
	protected removeBuffBonusPerks(target: PLAYER, perkName: string) {
		let perkBuffs = this.getPerkBuffs(target, perkName);
		if (perkBuffs.size === 0) {
			// todo apply the diff
			removeBonusPerks({perks: this.services.getBonusPerks(perkName)}, target);
		}

	}

	public isMobInBuff(room: string, mobId: string, perkName: string): boolean {
		const mobBuffs = this.getMobBuffsInstance(room, mobId);
		const hasBuff = mobBuffs.has(perkName);
		return hasBuff;
	}

	public isSocketInBuff(socket: GameSocket, perkName: string): boolean {
		const hasBuff = socket.buffs.has(perkName);
		return hasBuff;
	}

	public mobStartSpellsPicker(mob: MOB_INSTANCE) {
		let timersMap: Map<string, NodeJS.Timer> = new Map();
		
		for (let spellKey in mob.spells) {
			this.activateMobSpellTimer(mob, spellKey, timersMap, false);
		}

		this.mobsSpellsPickers.set(mob.id, timersMap);
	}

	private activateMobSpellTimer(mob: MOB_INSTANCE, spellKey: string, timersMap: Map<string, NodeJS.Timer>, justSkippedSpell: boolean) {
		const {minTime, maxTime} = mob.spells[spellKey];
		const time = justSkippedSpell ? talentsConfig.SKIP_SPELL_RETRY_TIME : this.services.getMobSpellRestTime(minTime, maxTime);
		const timerId = setTimeout(() => {
            const canUseSpell = this.canMobUseSpell(mob);
            if (canUseSpell) {
                this.mobUsesSpell(mob, spellKey);
            }
			// recursively use the spell
			this.activateMobSpellTimer(mob, spellKey, timersMap, !canUseSpell);
		}, time);
		timersMap.set(spellKey, timerId);
	}

    public mobUsesSpell(mob: MOB_INSTANCE, spellKey: string) {
        this.io.to(mob.room).emit(talentsConfig.CLIENT_GETS.MOB_USE_SPELL.name, {
            mob_id: mob.id,
            spell_key: spellKey,
        });
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
    
    protected canMobUseSpell(mob: MOB_INSTANCE): boolean {
        return !this.isMobInBuff(mob.room, mob.id, talentsConfig.PERKS.STUN_CHANCE) && !this.isMobInBuff(mob.room, mob.id, talentsConfig.PERKS.FREEZE_CHANCE);
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

	protected getMobBuffsInstance(room: string, mobId: string, createIfMissing: boolean = false) {
		let roomBuffs = this.getRoomBuffsInstance(room, createIfMissing);
		let mobBuffs = roomBuffs.get(mobId);
		if (!mobBuffs) {
			mobBuffs = new Map();
			if (createIfMissing) {
				roomBuffs.set(mobId, mobBuffs);
			}
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