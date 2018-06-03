import MasterController from '../master/master.controller';
import TalentsServices, { getRoom, getId, isSocket, isMob, getPerkConfig } from './talents.services';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import * as _ from 'underscore';
import combatConfig from '../combat/combat.config';
import { getController } from '../main/bootstrap';
import { modifyBonusPerks, addBonusPerks, removeBonusPerks } from '../bonusPerks/bonusPerks.services';
import { getSetOfMap, getMapOfMap } from '../utils/maps';
import { getPartyMembersInMap } from '../party/party.services';

export default class TalentsController extends MasterController {
	protected services: TalentsServices;
	// room => mob => perk name => buff instance[]
	protected roomToBuff: Map<string, Map<string, Map<string, Set<BUFF_INSTANCE>>>> = new Map();

	init(files, app) {
		super.init(files, app);
	}
	
	public applySelfPerks(dmg: number, socket: GameSocket) {
		const hp = this.getStealStatValue(talentsConfig.PERKS.HP_STEAL_CHANCE, talentsConfig.PERKS.HP_STEAL_MODIFIER, dmg, socket);
		if (hp > 0) {
			socket.emitter.emit(statsConfig.SERVER_INNER.GAIN_HP.name, { hp, cause: statsConfig.REGEN_CAUSE.STEAL }, socket);
		}
		const mp = this.getStealStatValue(talentsConfig.PERKS.MP_STEAL_CHANCE, talentsConfig.PERKS.MP_STEAL_MODIFIER, dmg, socket);
		if (mp > 0) {
			socket.emitter.emit(statsConfig.SERVER_INNER.GAIN_MP.name, { mp, cause: statsConfig.REGEN_CAUSE.STEAL }, socket);
		}
	}
	
	protected getStealStatValue(perkChanceName: string, perkModifierName: string, dmg, attacker: HURTER): number {
		let value = 0;
		let activated = this.services.isAbilityActivated(perkChanceName, attacker);	
		if (activated) {
			const stealPercent = this.services.getAbilityPerkValue(perkModifierName, attacker);
			value = this.services.getStealValue(dmg, stealPercent);
		}
		return value;

	}

	public applyHurtPerks(dmg: number, crit: boolean, attacker: HURTER, target: PLAYER, socket: GameSocket) {
		this.tryToApplyPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, talentsConfig.PERKS.STUN_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, talentsConfig.PERKS.CRIPPLE_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, talentsConfig.PERKS.BLEED_RESISTANCE, attacker, target, (buffInstace) => this.triggerBleed(dmg, crit, buffInstace, attacker, target, socket));
		this.tryToApplyPerk(talentsConfig.PERKS.FREEZE_CHANCE, talentsConfig.PERKS.FREEZE_DURATION, talentsConfig.PERKS.FREEZE_RESISTANCE, attacker, target);
		this.tryToApplyPerk(talentsConfig.PERKS.BURN_CHANCE, talentsConfig.PERKS.BURN_DURATION, talentsConfig.PERKS.BURN_RESISTANCE, attacker, target, (buffInstace) => this.triggerBurn(dmg, crit, buffInstace, attacker, target, socket));
		
		if (isSocket(attacker) || isMob(attacker)) {
			if (attacker.currentSpell && attacker.currentSpell.clearBuffs) {
				this.clearBuffs(target, attacker.currentSpell.clearBuffs);
			}
		}
	}

	public applySelfBuffPerks(attacker: PLAYER) {
		let buffPerks = this.services.getBuffPerks();
		for (let [perkChanceName, perkDurationName] of buffPerks) {
			this.tryToApplyPerk(perkChanceName, perkDurationName, null, attacker, attacker, (buffInstace, buffTarget) => this.addBuffBonusPerks(buffTarget, perkChanceName), (buffTarget) => this.removeBuffBonusPerks(buffTarget, perkChanceName));
		}
	}

	public tryToApplyPerk(perkName: string, perkDurationName: string, perkResistanceName: string, attacker: HURTER, target: PLAYER, onPerkActivated = (buffInstace: BUFF_INSTANCE, buffTarget: PLAYER) => {}, onPerkCleared = (buffTarget: PLAYER) => {}) {
		let activated = this.services.isAbilityActivated(perkName, attacker);	
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
			let targets = this.getPerkBuffTargets(attacker, target, perkName);
			for (let buffTarget of targets) {
				this.applyPerkBuff(buffTarget, perkName, duration, onPerkActivated, onPerkCleared);
			}
		}
	}

	private getPerkBuffTargets(attacker: HURTER, target: PLAYER, perkName: string) {
		let targets: PLAYER[] = [target];
		if (isSocket(target) && getPerkConfig(perkName).party) {
			targets = getPartyMembersInMap(target);
		}
		return targets;
	}

	protected applyPerkBuff(target: PLAYER, perkName: string, duration: number, onPerkActivated: (buffInstace: BUFF_INSTANCE, buffTarget: PLAYER) => void, onPerkCleared: (buffTarget: PLAYER) => void) {
		this.io.to(getRoom(target)).emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
			target_id: getId(target),
			key: perkName,
			duration,
		});
		let clearTimeoutId = setTimeout(() => this.clearBuff(target, buffInstace), duration * 1000);
		var buffInstace = {
			clearTimeoutId,
			perkName: perkName,
			duration,
			onPerkCleared,
			initTime: Date.now(),
		};
		this.addBuff(target, buffInstace);
		onPerkActivated(buffInstace, target);
	}

	protected clearBuff(target: PLAYER, buffInstace: BUFF_INSTANCE) {
		return isSocket(target) 
			? this.clearSocketBuff(target, buffInstace)
			: this.clearMobBuff(target, buffInstace);
		}
		
	protected addBuff(target: PLAYER, buffInstace: BUFF_INSTANCE) {
		let buffs = isSocket(target) 
			? this.getSocketPerkBuffs(target, buffInstace.perkName, true)
			: this.getMobPerkBuffs(target, buffInstace.perkName, true);
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

	protected clearMobBuff(mob: MOB_INSTANCE, buffInstance: BUFF_INSTANCE) {
		clearTimeout(buffInstance.clearTimeoutId);
		const {room, id} = mob;
		
		let roomMap = this.getRoomBuffsInstance(room);
		let mobsBuff = this.getMobBuffsInstance(room, id);
		
		let perkBuffs = mobsBuff.get(buffInstance.perkName);
		perkBuffs.delete(buffInstance);
		if (perkBuffs.size === 0) {
			mobsBuff.delete(buffInstance.perkName);
		}
		
		if (mobsBuff.size === 0) {
			roomMap.delete(id);
		}
		if (roomMap.size === 0) {
			this.roomToBuff.delete(room);
		}
		buffInstance.onPerkCleared(mob);
	}
	
	protected clearSocketBuff(socket: GameSocket, buffInstance: BUFF_INSTANCE): void {
		clearTimeout(buffInstance.clearTimeoutId);
		let perkBuffs = this.getSocketPerkBuffs(socket, buffInstance.perkName);
		perkBuffs.delete(buffInstance);
		if (perkBuffs.size === 0) {
			socket.buffs.delete(buffInstance.perkName);
		}
		buffInstance.onPerkCleared(socket);
	}
	
	public clearBuffs(target: PLAYER, buffNames?: string[]): void {
		const buffs = this.getBuffs(target);
		if (buffNames) {
			buffNames.forEach(buffName => {
				getSetOfMap(buffs, buffName).forEach(buffInstance => this.clearBuff(target, buffInstance));
			});
		} else {
			buffs.forEach(perkBuffs => perkBuffs.forEach(buffInstance => this.clearBuff(target, buffInstance)));
		}
		
		this.io.to(getRoom(target)).emit(talentsConfig.CLIENT_GETS.CLEARED_BUFF.name, {
			target_id: getId(target),
			buff_names: buffNames,
		});
	}

	protected getBuffs(target: PLAYER) {
		return isSocket(target) 
			? target.buffs 
			: this.getMobBuffsInstance(target.room, target.id);
	}

	protected getPerkBuffs(target: PLAYER, perkName: string, createIfMissing: boolean = false) {
		return isSocket(target) 
			? this.getSocketPerkBuffs(target, perkName, createIfMissing)
			: this.getMobPerkBuffs(target, perkName, createIfMissing);
	}
	
	protected getSocketPerkBuffs(socket: GameSocket, perkName: string, createIfMissing: boolean = false): Set<BUFF_INSTANCE> {
		return getSetOfMap(socket.buffs, perkName, createIfMissing);
	}

	protected getMobPerkBuffs(mob: MOB_INSTANCE, perkName: string, createIfMissing: boolean = false): Set<BUFF_INSTANCE> {
		let mobBuffs = this.getMobBuffsInstance(mob.room, mob.id, createIfMissing);
		return getSetOfMap(mobBuffs, perkName, createIfMissing);
	}

	protected triggerBleed(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, attacker: HURTER, target: PLAYER, socket: GameSocket) {
		let bleedDmg = this.services.getBleedDmg(dmg);
		this.tickDmg(bleedDmg, crit, buffInstance, combatConfig.HIT_CAUSE.BLEED, talentsConfig.PERKS_INFO.BLEED_TICK_TIME, attacker, target, socket);
	}

	protected triggerBurn(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, attacker: HURTER, target: PLAYER, socket: GameSocket) {
		let burnDmg = this.services.getBurnDmg(dmg);
		this.tickDmg(burnDmg, crit, buffInstance, combatConfig.HIT_CAUSE.BURN, talentsConfig.PERKS_INFO.BURN_TICK_TIME, attacker, target, socket);
	}

	protected tickDmg(dmg: number, crit: boolean, buffInstance: BUFF_INSTANCE, cause: string, interval: number, attacker: HURTER, target: PLAYER, socket: GameSocket, tickIndex = 0, ability?: string) {
		if (!ability && isSocket(attacker)) {
			// make sure we tick on the ability at the buff creation time
			ability = attacker.character.stats.primaryAbility;
		}
		let buffTimer = setTimeout(() => {
			if (isSocket(attacker)) {
				if (!attacker.connected || !attacker.alive || attacker.character.room !== getRoom(target)) {
					return this.clearBuff(target, buffInstance);
				}
				// make sure the ticking is going on the correct ability that was used
				var previousAbility = attacker.character.stats.primaryAbility;
				attacker.character.stats.primaryAbility = ability;
			}

			this.tickDmg(dmg, crit, buffInstance, cause, interval, attacker, target, socket, tickIndex + 1, ability);
			
			socket.emitter.emit(combatConfig.SERVER_INNER.HURT_TARGET.name, {attacker, target, cause, dmg, crit}, socket);			
			
			if (isSocket(attacker)) {
				attacker.character.stats.primaryAbility = previousAbility;
			}
		}, interval * 1000 - (tickIndex === 0 ? 100 : 0)); // reducing 100 ms so all the ticks will fit in the time
		
		buffInstance.onPerkCleared = () => clearTimeout(buffTimer);
	}

	protected addBuffBonusPerks(target: PLAYER, perkName: string) {
		let perkBuffs = this.getPerkBuffs(target, perkName);
		if (perkBuffs.size === 1) {
			modifyBonusPerks(target, () => {
				addBonusPerks({perks: this.services.getBonusPerks(perkName)}, target);			
			});
		}
	}
	
	protected removeBuffBonusPerks(target: PLAYER, perkName: string) {
		let perkBuffs = this.getPerkBuffs(target, perkName);
		if (perkBuffs.size === 0) {
			modifyBonusPerks(target, () => {
				removeBonusPerks({perks: this.services.getBonusPerks(perkName)}, target);			
			});
		}
	}

	protected getRoomBuffsInstance(room: string, createIfMissing: boolean = false): Map<string, Map<string, Set<BUFF_INSTANCE>>> {
		return getMapOfMap(this.roomToBuff, room, createIfMissing);
	}
	
	public getMobBuffsInstance(room: string, mobId: string, createIfMissing: boolean = false): Map<string, Set<BUFF_INSTANCE>> {
		let roomBuffs = this.getRoomBuffsInstance(room, createIfMissing);
		return getMapOfMap(roomBuffs, mobId, createIfMissing);
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

export function getTalentsController(): TalentsController {
    return getController("talents");
}