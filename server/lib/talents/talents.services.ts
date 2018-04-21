import MasterServices from '../master/master.services';
import SocketioRouter from '../socketio/socketio.router';
import * as _ from 'underscore';
import { doesChanceWorkFloat } from '../drops/drops.services';
import talentsConfig from "../talents/talents.config";
import TalentsController from './talents.controller';
import { getRoomInfo, getRoomName } from '../rooms/rooms.services';
import { getServices, getEmitter } from '../main/bootstrap';
import { isMobInBuff } from './talents.controller';
import { extendMobSchemaWithSpells, extendTalentsGenerationWithSpells } from '../spells/spells.model';

export default class TalentsServices extends MasterServices {
	private controller: TalentsController;
	public abilitiesInfo: Map<string, TALENT_INFO> = new Map();
	private perksInfo: Map<string, ABILITY_PERK_INSTANCE[]> = new Map();
	// buffPerkChance => buffPerkDuration
	private buffPerks: Map<string, string> = new Map();

	protected socketioRouter: SocketioRouter;
	
	init(files, app) {
		this.controller = files.controller;
		super.init(files, app);
		this.socketioRouter = files.routers.socketio;
	}

    public setBuffPerks() {
		let {perks} = this.socketioRouter.getConfig();
		for (let perkName in perks) {
			let perkConfig = perks[perkName];
			if (perkConfig.bonusPerks) {
				let perkDurationName = perkName.replace("Chance", "Duration");
				if (perkDurationName !== perkName && perks[perkDurationName]) {
					this.buffPerks.set(perkName, perkDurationName);
				}
			}
		}
	}
	
	public getBuffPerks() {
		return this.buffPerks;
	}

	public getEmptyCharAbility(ability: string): CHAR_ABILITY_TALENT {
		let talentInfo = getTalentInfo(ability);
		let perks = Object.assign({}, talentInfo.initPerks);
		return {
			lvl: 1,
			exp: 0,
			points: 0,
			pool: [],
			perks,
		};
	}

	public markAbilityModified(socket: GameSocket, ability: string) {
		if (isCharAbility(ability)) {
			socket.character.charTalents.markModified(ability);		
		} else {
			socket.character.talents.markModified(ability);		
		}
	}

	public getAbilityExp(dmg: number, mob: MOB_MODEL) {
		return Math.min(dmg / mob.hp, 1) * mob.exp * 2 | 0 || 1;
	}

	public getPerksPool(ability: string, talent: CHAR_ABILITY_TALENT): string[] {
		let poolLvl = talent.lvl - (talent.points - 1);
		let abilityInfo = this.perksInfo.get(ability);
		// if surpass max info - reset it
		if (poolLvl > abilityInfo.length - 1) {
			poolLvl = abilityInfo.length - 1;
		}
		const perkInstance = abilityInfo[poolLvl];
		let pool = this.filterPool(perkInstance.pool, talent.perks);
		pool = this.pickPool(pool, perkInstance.perksOffered);
		return pool;
	}
	
	protected filterPool(pool: string[], charPerks: PERK_MAP): string[] {
		let newPool = [];
		pool.forEach(perk => {
			const perkConfig = this.getPerkConfig(perk);
			const level = charPerks[perk] || 0;
			const charPerkValue = this.getPerkLevelValue(perk, level);
			if (this.isBelowMax(perkConfig, charPerkValue)) {
				newPool.push(perk);
			}
		});
		
		return newPool;
	}

	protected isBelowMax(perkConfig: PERK_CONFIG, value: number): boolean {
		return !perkConfig.max || (perkConfig.value > 0 ? value < perkConfig.max : value > perkConfig.max);
	}
	
	protected getPerkLevelValue(perk: string, level: number): number {
		const perkConfig = this.getPerkConfig(perk);
		const initialValue = perkConfig.default || 0;
		const acceleration = perkConfig.acc || 0;
		const valueModifier = perkConfig.value;
		// Gauss formula => 1 + 2 + 3 + ... + n = n * (n + 1) / 2
		const sumValuesUntilLevel = (level - 1) * level / 2;
		// 1 * x + 2 * x + ... + n * x = (1 + 2 + 3 + ... + n) * x
		const accelerationPoint = sumValuesUntilLevel * acceleration;
		return initialValue + level * valueModifier + accelerationPoint;
	}
	
	protected getSafePerkValue(perk: string, value: number) {
		const perkConfig = this.getPerkConfig(perk);
		if (!this.isBelowMax(perkConfig, value)) {
			value = perkConfig.max;
		}
		return value;
	}
	
	protected pickPool(pool: string[], perksOffered: number): string[] {
		return _.sample(pool, perksOffered);
	}

	public canGetPerk(talent: CHAR_ABILITY_TALENT, perk?: string): boolean {
		return (<any>talent.pool).includes(perk);
	}

	public addPerk(talent: CHAR_ABILITY_TALENT, perk: string) {
		talent.perks[perk] = (talent.perks[perk] || 0) + 1;
	}

	protected getPerkConfig(perk: string): PERK_CONFIG {
		const config = this.socketioRouter.getConfig();
		const perkConfig: PERK_CONFIG = config.perks[perk] || <any>{};
		return perkConfig;
    }
    
    public getPerkDefault(perk: string): number {
        return this.getPerkConfig(perk).default || 0;
    }
    
    public getBonusPerks(perk: string): PERK_MAP {
        return this.getPerkConfig(perk).bonusPerks || {};
    }

	public getTargetsHit(targetIds: string[], socket: GameSocket): string[] {
		if (targetIds.length <= 1) {
			return targetIds;
		}
		const aoeActivated = this.isAbilityActivated(talentsConfig.PERKS.AOE_CHANCE, socket);
		if (!aoeActivated) {
			return [targetIds[0]];
		}
		const aoeValue = this.getAbilityPerkValue(talentsConfig.PERKS.AOE_CAP, socket);
		return targetIds.slice(0, aoeValue);
	}

	public getLoadModifier(socket: GameSocket): number {
		const chargeModifier = this.getAbilityPerkValue(talentsConfig.PERKS.CHARGE_MODIFIER_KEY, socket);
		return chargeModifier;
    }
    
    public getDmgBonus(socket: GameSocket): number {
        const baseDmgBonus = this.getCharPerkValue(talentsConfig.PERKS.DMG_BONUS, socket);
		const talentInfo = getTalentInfo(socket.character.stats.primaryAbility);
        const abilityBonusPerk = talentInfo.powerType + talentsConfig.PERKS_INFO.ABILITY_DMG_BONUS_SUFFIX;
        const abilityDmgBonus = this.getCharPerkValue(abilityBonusPerk, socket);
        return baseDmgBonus + abilityDmgBonus;
    }

	public getDmgModifier(attacker: PLAYER, target: PLAYER): DMG_RESULT {
		const dmgModifier = this.getAbilityPerkValue(talentsConfig.PERKS.DMG_MODIFIER_KEY, attacker);
		let modifier = dmgModifier;
		const critActivated = this.isAbilityActivated(talentsConfig.PERKS.CRIT_CHANCE, attacker);
		if (critActivated) {
			let perkModifier = this.getAbilityPerkValue(talentsConfig.PERKS.CRIT_MODIFIER_KEY, attacker);
			modifier *= perkModifier;
		}
		if (this.isFrozen(target)) {
			let perkModifier = this.getAbilityPerkValue(talentsConfig.PERKS.FROZEN_TARGET_MODIFIER_KEY, attacker);
			modifier *= perkModifier;
		}
		if (this.isBurnt(target)) {
			let perkModifier = this.getAbilityPerkValue(talentsConfig.PERKS.BURNT_TARGET_MODIFIER_KEY, attacker);
			modifier *= perkModifier;
		}
		return {dmg: modifier, crit: critActivated};
	}

	public getMinDmgModifier(attacker: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MIN_DMG_MODIFIER, attacker);
    }
    
	public getThreatModifier(target: PLAYER): number {
		const threatModifier = this.getAbilityPerkValue(talentsConfig.PERKS.THREAT_MODIFIER_KEY, target);
		return threatModifier;
	}

	public getDefenceModifier(attacker: PLAYER, target: PLAYER): number {
		const isBlock = this.isAttackBlocked(attacker, target);
		let defenceModifier = 0; // complete block
		if (!isBlock) {
			let dmgReduction = this.getAbilityPerkValue(talentsConfig.PERKS.DAMAGE_REDUCTION, target);
			defenceModifier = 1 - dmgReduction;
		}
		return defenceModifier;
    }
    
	private isAttackBlocked(attacker: PLAYER, target: PLAYER) {
		return this.isAbilityActivated(talentsConfig.PERKS.BLOCK_CHANCE, target)
			// block if the socket is using a non-supported ability
			|| (isSocket(attacker) && isAbilityNotSupportedInRoom(<GameSocket>attacker));
	}

	public getSpikesModifier(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.SPIKES_MODIFIER, target);
	}
	
	public getDefenceBonus(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.DEFENCE_BONUS, target);
    }
    
	public getHpRegenModifier(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.HP_REGEN_MODIFIER, target);
	}
	
	public getMpRegenModifier(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_REGEN_MODIFIER, target);
	}
	
	public getHpRegenInterval(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.HP_REGEN_INTERVAL, target) * 1000;
	}
	
	public getMpRegenInterval(target: PLAYER): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_REGEN_INTERVAL, target) * 1000;
	}

	public getMpUsageModifier(target: PLAYER, ability?: string): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_COST, target, ability);
	}
	
	public isAbilityActivated(perk: string, target: HURTER): boolean {
		const value = this.getAbilityPerkValue(perk, target);
		const activated = doesChanceWorkFloat(value);
		return activated;
	}
	
	public getAbilityPerkValue(perk: string, target: HURTER, ability?: string): number {
		return isSocket(target) 
			? this.getCharPerkValue(perk, <GameSocket>target, ability)
			: isMob(target) 
				? this.getMobPerkValue(perk, <MOB_INSTANCE>target)
				: this.getGeneralPerkValue(perk, <MOB_INSTANCE>target);
	}
	
	protected getCharPerkValue(perk: string, socket: GameSocket, ability?: string): number {
		ability = ability || socket.character.stats.primaryAbility;
        const talent = socket.character.talents._doc[ability];
        if (!talent) {
            const perkConfig = this.getPerkConfig(perk);
            return perkConfig.default || 0;
        }
        const level = (talent.perks[perk] || 0) + this.getCharTalentsLevel(socket, perk);
		let perkValue = this.getPerkLevelValue(perk, level);
		perkValue = this.addPerkValueBonuses(socket, perk, perkValue);
		return perkValue;
	}

	protected getCharTalentsLevel(socket: GameSocket, perk: string): number {
		let sum = 0;
		for (let ability in socket.character.charTalents._doc) {
			sum += socket.character.charTalents._doc[ability].perks[perk] || 0;
		}
		return sum;
	}
	
	protected getMobPerkValue(perk: string, mob: MOB_INSTANCE): number {
		let perkValue = this.getGeneralPerkValue(perk, mob);
		
		perkValue = this.addPerkValueBonuses(mob, perk, perkValue);
		
		return perkValue;
	}
	
	protected getGeneralPerkValue(perk: string, target: PERKABLE): number {
		// get the perk if exists, otherwise get its default
		return (target.perks || {})[perk] || this.getPerkLevelValue(perk, 0);
	}

	protected addPerkValueBonuses(target: PLAYER, perkName: string, perkValue: number): number {
		if (target.currentSpell) {
			// send the higher value - perk or spell
			let spellPerkValue = (target.currentSpell.perks || {})[perkName] || 0;
			perkValue = this.getBetterPerkValue(perkName, spellPerkValue, perkValue);
		}
		let bonusPerkValue = target.bonusPerks[perkName] || 0;
		let safePerkValueWithBonus = this.getSafePerkValue(perkName, perkValue + bonusPerkValue);
		// we want to add the bonus up to the max value, after that take the original value
		perkValue = this.getBetterPerkValue(perkName, perkValue, safePerkValueWithBonus);
		return perkValue;
	}

	protected getBetterPerkValue(perk: string, ...values: number[]): number {
		const perkConfig = this.getPerkConfig(perk);
		return perkConfig.value > 0 ? Math.max(...values) : Math.min(...values);
	}

	protected isFrozen(target: PLAYER): boolean {
		return this.hasBuff(target, talentsConfig.PERKS.FREEZE_CHANCE);
	}

	protected isBurnt(target: PLAYER): boolean {
		return this.hasBuff(target, talentsConfig.PERKS.BURN_CHANCE);
	}

	protected hasBuff(target: PLAYER, perkName: string): boolean {
		return isSocket(target) 
			? this.controller.isSocketInBuff(<GameSocket>target, perkName)
			: isMobInBuff((<MOB_INSTANCE>target).room, (<MOB_INSTANCE>target).id, perkName);
	}

	public getBleedDmg(dmg: number): number {
		return Math.max(dmg * talentsConfig.PERKS_INFO.BLEED_DMG_MODIFIER | 0, 1);
	}

	public getBurnDmg(dmg: number): number {
		return Math.max(dmg * talentsConfig.PERKS_INFO.BURN_DMG_MODIFIER | 0, 1);
	}

	public getStealValue(value, percent): number {
		return Math.ceil(value * percent);
	}

	public addAbility(socket: GameSocket, ability: string) {
		const talent = this.getEmptyCharAbility(ability);
		if (isCharAbility(ability)) {
			socket.character.charTalents._doc[ability] = talent;
		} else {
			socket.character.talents._doc[ability] = talent;
		}
		this.markAbilityModified(socket, ability);
	}

    // HTTP functions
	// =================
    public generateTalents(talents: any[], perkCollection: any[]): Promise<any> {
		console.log("Generating talents from data:", talents);
		
		let models = [];

		(talents || []).forEach(talent => {
			let talentSchema: TALENT_MODEL = {
				ability: talent.ability,
				perks: [],
				spells: [],
				info: {
					powerType: talent.powerType,
					initPerks: {}
				}
			};
			if (talent.hitType) {
				talentSchema.info.hitType = talent.hitType;
			}

			(talent.perks || []).forEach(perk => {
				let perkSchema = {
					atLeastLvl: perk.atLeastLvl,
					perksOffered: perk.perksOffered,
					addToPool: perk.addToPool,
				};
				talentSchema.perks.push(perkSchema);
            });
            
            extendTalentsGenerationWithSpells(talent, talentSchema);
			
			(talent.initialPerks || []).forEach(perk => {
				talentSchema.info.initPerks[perk.key] = +perk.value;
			});

			if (talent.manaCost > 0) {
				talentSchema.info.mp = +talent.manaCost;
			}

			let talentModel = new this.Model(talentSchema);
			models.push(talentModel);
		});

		const talentsPromise = this.Model.remove({})
			.then(d => this.Model.create(models));

		const perksPromise = this.generatePerksConfig(perkCollection);

		return Promise.all([talentsPromise, perksPromise]);
	}

	private generatePerksConfig(perkCollection: any[]): Promise<any> {
		let config = this.socketioRouter.getConfig();

		let perks = {};
		(perkCollection || []).forEach(perk => {
			let perkModel: PERK_CONFIG = {
				value: +perk.value,
				type: perk.type,
			};
			if (+perk.max) {
				perkModel.max = +perk.max;
			}
			if (+perk.acc) {
				perkModel.acc = +perk.acc;
			}
			if (+perk.default) {
				perkModel.default = +perk.default;
			}
			if (perk.bonusPerks) {
				let {perks} = getPerksSchema(perk.bonusPerks);
				perkModel.bonusPerks = perks;
			}
			if (perk.client === "true") {
				perkModel.client = true;
			}
			perks[perk.key] = perkModel;
		});

		config.perks = perks;
		return config.save();
	}

    public getTalents(): Promise<Map<string, ABILITY_PERK_INSTANCE[]>> {
		return this.Model.find({}).lean()
			.then((docs: TALENT_MODEL[]) => {
				docs.forEach(doc => {
					const perksArray = this.getLvlPerksArray(doc.perks);
                    this.perksInfo.set(doc.ability, perksArray);

					this.abilitiesInfo.set(doc.ability, doc.info);
                    
                    getEmitter().emit(talentsConfig.GLOBAL_TALENT_READY.name, {doc});
				});
				console.log("got talents");
				return this.perksInfo;
			});
		}
		
	protected getLvlPerksArray(perks) {
		let perksLvls: {[lvl: number]: ABILITY_PERK_MODEL} = {};
		let max = 0;
		perks.forEach(perk => {
			max = Math.max(perk.atLeastLvl, max);
			perksLvls[perk.atLeastLvl] = perk;
		});

		let perksArray: ABILITY_PERK_INSTANCE[] = new Array(max + 1);
		let lastPerk: ABILITY_PERK_INSTANCE = {
			perksOffered: 0,
			pool: [],
		};
		for (let i = 0; i < perksArray.length; i++) {
			if (perksLvls[i]) {
				lastPerk = {
					perksOffered: perksLvls[i].perksOffered,
					pool: lastPerk.pool.concat(perksLvls[i].addToPool),
				};
			}
			perksArray[i] = lastPerk;
		}
		return perksArray;
	}
};

export function extendMobSchemaWithTalents(mob: any, mobSchema: MOB_MODEL): void {
	(mob.perks || []).forEach(perk => {
		mobSchema.perks = mobSchema.perks || {};
		mobSchema.perks[perk.key] = +perk.value;
    });
    extendMobSchemaWithSpells(mob, mobSchema);
}

export function getPerksSchema(perkList?: any[]): {perks: PERK_MAP} {
    let perks: PERK_MAP = {};
    (perkList || []).forEach(perk => {
        perks[perk.key] = +perk.value;
    });
    let perksObjectResult = {
        perks,
    };
    return perksObjectResult;
}

export function extendRoomSchemaWithTalents(scene: any, roomSchema: ROOM_MODEL): void {
    let abilities: ROOM_ABILITIES = null;
    (scene.abilities || []).forEach(ability => {
        abilities = abilities || {};
        abilities[ability] = true;
    });
    roomSchema.abilities = abilities;
}

export function getTalentsServices(): TalentsServices {
    return getServices("talents");
}

export function getTalentInfo(ability: string): TALENT_INFO|undefined {
	return getTalentsServices().abilitiesInfo.get(ability);
}

export function isCharAbility(ability: string): boolean {
	let talentInfo = getTalentInfo(ability);
	return talentInfo.hitType === undefined;
}

export function getTalent(socket: GameSocket, ability: string): CHAR_ABILITY_TALENT {
	return isCharAbility(ability) ? socket.character.charTalents._doc[ability] : socket.character.talents._doc[ability];
}

export function hasAbility(socket: GameSocket, ability: string): boolean {
	return !!socket.character.talents._doc[ability];
}

export function canUseAbility(socket: GameSocket, ability: string): boolean {
	return hasAbility(socket, ability) || isAbilitySupportedInRoom(socket, ability);
}

export function isAbilitySupportedInRoom(socket: GameSocket, ability?: string, room?: string): boolean {
	room = room || getRoomName(socket);
	ability = ability || socket.character.stats.primaryAbility;
    const roomInfo = getRoomInfo(room);
	return roomInfo.abilities && roomInfo.abilities[ability];
}

export function isAbilityNotSupportedInRoom(socket: GameSocket, ability?: string, room?: string): boolean {
	room = room || getRoomName(socket);
	ability = ability || socket.character.stats.primaryAbility;
    const roomInfo = getRoomInfo(room);
	return roomInfo.abilities && !roomInfo.abilities[ability];
}

export function isSocket(target: HURTER): boolean {
	return typeof (<GameSocket>target).user !== "undefined";
}

export function isMob(target: HURTER): boolean {
	return typeof (<MOB_INSTANCE>target).mobId !== "undefined";
}

export function getRoom(target: PLAYER): string {
	return isSocket(target) 
		? (<GameSocket>target).character.room
		: (<MOB_INSTANCE>target).room;
}

export function getId(target: PLAYER): string {
	return isSocket(target) 
		? (<GameSocket>target).character._id
		: (<MOB_INSTANCE>target).id;
}

export function getMpUsage(mp: number, socket: GameSocket): number {
	return Math.round(mp * socket.getMpUsageModifier());
}

export function applySpikes(dmg: number, spikesModifier: number): number {
    return Math.round(dmg * spikesModifier);
}