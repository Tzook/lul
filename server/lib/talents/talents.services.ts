import MasterServices from '../master/master.services';
import SocketioRouter from '../socketio/socketio.router';
import * as _ from 'underscore';
import { doesChanceWorkFloat } from '../drops/drops.services';
import talentsConfig from "../talents/talents.config";
import TalentsController from './talents.controller';
import { getRoomInfo } from '../rooms/rooms.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { getServices } from '../main/bootstrap';
import statsConfig from '../stats/stats.config';

export default class TalentsServices extends MasterServices {
	private controller: TalentsController;
	private abilitiesInfo: Map<string, TALENT_INFO> = new Map();
	private perksInfo: Map<string, ABILITY_PERK_INSTANCE[]> = new Map();
	// primary ability => lvl|key => spell
	private spellsInfo: Map<string, Map<number|string, ABILITY_SPELL_MODEL>> = new Map();
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
		let talentInfo = this.getTalentInfo(ability);
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
		const talentInfo = this.getTalentInfo(socket.character.stats.primaryAbility);
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
    
	public getAtkSpeedModifier(target: PLAYER, ability?: string): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.ATK_SPEED_MODIFIER_KEY, target, ability);
	}

	public getThreatModifier(target: PLAYER): number {
		const threatModifier = this.getAbilityPerkValue(talentsConfig.PERKS.THREAT_MODIFIER_KEY, target);
		return threatModifier;
	}

	public getDefenceModifier(attacker: PLAYER, target: PLAYER): number {
		const isBlock = this.isAbilityActivated(talentsConfig.PERKS.BLOCK_CHANCE, target);
		let defenceModifier = 0; // complete block
		if (!isBlock) {
			let dmgReduction = this.getAbilityPerkValue(talentsConfig.PERKS.DAMAGE_REDUCTION, target);
			defenceModifier = 1 - dmgReduction;
		}
		return defenceModifier;
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

	public getHpBonus(target: PLAYER, ability?: string): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.HP_BONUS, target, ability);
	}
	
	public getMpBonus(target: PLAYER, ability?: string): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_BONUS, target, ability);
	}

	public getMpUsageModifier(target: PLAYER, ability?: string): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_COST, target, ability);
	}
	
	public isAbilityActivated(perk: string, target: PLAYER): boolean {
		const value = this.getAbilityPerkValue(perk, target);
		const activated = doesChanceWorkFloat(value);
		return activated;
	}
	
	public getAbilityPerkValue(perk: string, target: PLAYER, ability?: string): number {
		return isSocket(target) 
			? this.getCharPerkValue(perk, <GameSocket>target, ability)
			: this.getMobPerkValue(perk, <MOB_INSTANCE>target); 
	}
	
	protected getCharPerkValue(perk: string, socket: GameSocket, ability?: string): number {
		ability = ability || socket.character.stats.primaryAbility;
        const talent = socket.character.talents._doc[ability];
        if (!talent) {
            const perkConfig = this.getPerkConfig(perk);
            return perkConfig.default || 0;
        }
        const level = (talent.perks[perk] || 0) + (socket.character.charTalents._doc[talentsConfig.CHAR_TALENT].perks[perk] || 0);
		let perkValue = this.getPerkLevelValue(perk, level);
		perkValue = this.addPerkValueBonuses(socket, perk, perkValue);
		return perkValue;
	}
	
	protected getMobPerkValue(perk: string, mob: MOB_INSTANCE): number {
		// get the perk if exists, otherwise get its default
		let perkValue = (mob.perks || {})[perk] || this.getPerkLevelValue(perk, 0);
		
		perkValue = this.addPerkValueBonuses(mob, perk, perkValue);
		
		return perkValue;
	}

	protected addPerkValueBonuses(target: PLAYER, perkName: string, perkValue: number): number {
		if (target.currentSpell) {
			// send the higher value - perk or spell
			let spellPerkValue = target.currentSpell.perks[perkName] || 0;
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
			: this.controller.isMobInBuff((<MOB_INSTANCE>target).room, (<MOB_INSTANCE>target).id, perkName);
	}

	public getBleedDmg(dmg: number): number {
		return Math.max(dmg * talentsConfig.PERKS_INFO.BLEED_DMG_MODIFIER | 0, 1);
	}

	public getBurnDmg(dmg: number): number {
		return Math.max(dmg * talentsConfig.PERKS_INFO.BURN_DMG_MODIFIER | 0, 1);
	}

	public getSpell(socket: GameSocket, spellKey: string): ABILITY_SPELL_MODEL|undefined {
		const ability = socket.character.stats.primaryAbility;
		return this.spellsInfo.get(ability).get(spellKey);
	}

	public canUseSpell(socket: GameSocket, spell: ABILITY_SPELL_MODEL): boolean {
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
		return talent && talent.lvl >= spell.lvl;
	}

	public getStealValue(value, percent): number {
		return value * percent | 0;
	}

	public getMobSpellRestTime(min: number, max: number): number {
		return _.random(min * 1000, max * 1000);
	}

	public getTalentInfo(ability: string): TALENT_INFO|undefined {
		return this.abilitiesInfo.get(ability);
	}

	public addAbility(socket: GameSocket, ability: string) {
		socket.character.talents._doc[ability] = this.getEmptyCharAbility(ability);
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
					hitType: talent.hitType,
					initPerks: {}
				}
			};

			(talent.perks || []).forEach(perk => {
				let perkSchema = {
					atLeastLvl: perk.atLeastLvl,
					perksOffered: perk.perksOffered,
					addToPool: perk.addToPool,
				};
				talentSchema.perks.push(perkSchema);
			});
			
			(talent.spells || []).forEach(spell => {
				let spellSchema: ABILITY_SPELL_MODEL = {
					key: spell.key,
					lvl: spell.level,
					mp: spell.mana,
					perks: {},
				};
				(spell.perks || []).forEach(perk => {
					spellSchema.perks[perk.key] = +perk.value;
				});
				talentSchema.spells.push(spellSchema);
			});
			
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

					const spellsArray = this.getSpellsArrayMap(doc.spells);
					this.spellsInfo.set(doc.ability, spellsArray);

					this.abilitiesInfo.set(doc.ability, doc.info);
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

	protected getSpellsArrayMap(spells: ABILITY_SPELL_MODEL[]){
		let result = new Map();

		for (let i = 0; i < spells.length; i++) {
			const spell = spells[i];
			result.set(spell.lvl, spell);
			result.set(spell.key, spell);
		}

		return result;
	}
};

export function extendMobSchemaWithTalents(mob: any, mobSchema: MOB_MODEL): void {
	(mob.perks || []).forEach(perk => {
		mobSchema.perks = mobSchema.perks || {};
		mobSchema.perks[perk.key] = +perk.value;
	});

	(mob.spells || []).forEach(spell => {
		mobSchema.spells = mobSchema.spells || {};
        let spellSchema: MOB_SPELL = <MOB_SPELL>getPerksSchema(spell.perks);
        spellSchema.minTime = spell.minTime;
        spellSchema.maxTime = spell.maxTime;
        mobSchema.spells[spell.key] = spellSchema;
    });
    
    if (mob.deathRattle) {
        let deathRattle: MOB_DEATH_SPELL = <MOB_DEATH_SPELL>getPerksSchema(mob.deathRattle.perks);
        deathRattle.key = mob.deathRattle.key;
        mobSchema.deathSpell = deathRattle;
    }
}

function getPerksSchema(perkList?: any[]): {perks: PERK_MAP} {
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
    let abilities: ROOM_ABILITIES;
    (scene.abilities || []).forEach(ability => {
        abilities = abilities || {};
        abilities[ability] = true;
    });
    if (abilities) {
        roomSchema.abilities = abilities;
    }
}

export function extendItemSchemaWithTalents(item: any, itemSchema: ITEM_MODEL) {
    (item.perks || []).forEach(perk => {
		itemSchema.perks = itemSchema.perks || {};
		itemSchema.perks[perk.key] = +perk.value;
	});
}

export function getTalentsServices(): TalentsServices {
    return getServices("talents");
}

export function isCharAbility(ability: string): boolean {
	return ability === talentsConfig.CHAR_TALENT;
}

export function getTalent(socket: GameSocket, ability: string): CHAR_ABILITY_TALENT {
	return isCharAbility(ability) ? socket.character.charTalents._doc[ability] : socket.character.talents._doc[ability];
}

export function hasAbility(socket: GameSocket, ability: string): boolean {
	return !!socket.character.talents._doc[ability];
}

export function canUseAbility(socket: GameSocket, ability: string, room?: string): boolean {
	return hasAbility(socket, ability) || isAbilitySupportedInRoom(room || socket.character.room, ability);
}

export function isAbilitySupportedInRoom(room: string, ability: string): boolean {
    const roomInfo = getRoomInfo(room);
	return roomInfo.abilities && roomInfo.abilities[ability];
}

export function createBonusPerks(socket: GameSocket) {
    socket.bonusPerks = {};
    for (var itemKey in EQUIPS_SCHEMA) {
        let equip: ITEM_INSTANCE = socket.character.equips[itemKey];
        addBonusPerks(equip, socket);
    }
}

export function addBonusPerks({perks = {}}: {perks?: PERK_MAP}, target: PLAYER) {
    for (let perkName in perks || {}) {
        target.bonusPerks[perkName] = target.bonusPerks[perkName] || 0;
        target.bonusPerks[perkName] += perks[perkName];
    }
}

export function removeBonusPerks({perks = {}}: {perks?: PERK_MAP}, target: PLAYER) {
    for (let perkName in perks || {}) {
        target.bonusPerks[perkName] -= perks[perkName];
        if (!target.bonusPerks[perkName]) {
            delete target.bonusPerks[perkName];
        }
    }
}

export function modifyBonusPerks(target: PLAYER, modificationsCallback: Function) {
	const oldStats = getBonusPerks(target);
	modificationsCallback();
	const newStats = getBonusPerks(target);
	if (isSocket(target)) {
		// currently only socket supports these perks..
		updateBonusPerks(<GameSocket>target, oldStats, newStats);
	}
}

export function getBonusPerks(target: PLAYER, ability?: string): PERKS_DIFF {
    const talentsServices = getTalentsServices();
    return {
        hp: talentsServices.getHpBonus(target, ability),
        mp: talentsServices.getMpBonus(target, ability),
        atkSpeed: talentsServices.getAtkSpeedModifier(target, ability),
        mpCost: talentsServices.getMpUsageModifier(target, ability),
    };
}

export function updateBonusPerks(socket: GameSocket, oldStats: PERKS_DIFF, newStats: PERKS_DIFF) {
	if (oldStats.hp != newStats.hp || oldStats.mp != newStats.mp) {
		const stats = {hp: newStats.hp - oldStats.hp, mp: newStats.mp - oldStats.mp};
		socket.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats }, socket);
	}
	if (oldStats.atkSpeed != newStats.atkSpeed) {
		socket.emit(talentsConfig.CLIENT_GETS.UPDATE_ATTACK_SPEED.name, {speed: newStats.atkSpeed});
	}
	if (oldStats.mpCost != newStats.mpCost) {
		socket.emit(talentsConfig.CLIENT_GETS.UPDATE_MANA_COST.name, {mpCost: newStats.mpCost});
	}
}

export function getEmptyBonusPerks(): PERKS_DIFF {
    const talentsServices = getTalentsServices();
    return { 
        hp: talentsServices.getPerkDefault(talentsConfig.PERKS.HP_BONUS), 
        mp: talentsServices.getPerkDefault(talentsConfig.PERKS.MP_BONUS), 
		atkSpeed: talentsServices.getPerkDefault(talentsConfig.PERKS.ATK_SPEED_MODIFIER_KEY),
		mpCost: talentsServices.getPerkDefault(talentsConfig.PERKS.MP_COST)
    };
}

export function slightlyTweakPerks(perksObject: PERK_MAP): PERK_MAP {
    let result: PERK_MAP = {};
    const offset = talentsConfig.PERK_VALUES_RANDOM_OFFSET;

    for (let perkName in perksObject) {
        let perkValue = perksObject[perkName];

        // get a random number between -0.1 and 0.1
        const random = Math.random() * offset * 2 - offset;
        let addition = perkValue * random;

        // round extra floating points
        const numberParts = ("" + perkValue / 10).split(".");
        const firstNoneZeroDigitIndex = numberParts[1] ? _.findIndex(numberParts[1].split(""), item => item !== "0") : -1;
        
        result[perkName] = +(perkValue + addition).toFixed(firstNoneZeroDigitIndex + 1);
    }    

    return result;
}

export function isSocket(target: PLAYER): boolean {
	return typeof (<MOB_INSTANCE>target).mobId === "undefined";
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