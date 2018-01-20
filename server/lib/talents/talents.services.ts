import MasterServices from '../master/master.services';
import SocketioRouter from '../socketio/socketio.router';
import * as _ from 'underscore';
import { doesChanceWorkFloat } from '../drops/drops.services';
import talentsConfig from "../talents/talents.config";

export default class TalentsServices extends MasterServices {
	private abilitiesInfo: Map<string, TALENT_INFO> = new Map();
	private perksInfo: Map<string, ABILITY_PERK_INSTANCE[]> = new Map();
	// primary ability => lvl|key => spell
	private spellsInfo: Map<string, Map<number|string, ABILITY_SPELL_MODEL>> = new Map();

	protected socketioRouter: SocketioRouter;
	
	init(files, app) {
		super.init(files, app);
		this.socketioRouter = files.routers.socketio;
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

	public markAbilityModified(socket: GameSocket) {
		const ability = socket.character.stats.primaryAbility;
		socket.character.talents.markModified(ability);		
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
			const charPerkValue = this.getPerkValue(perk, charPerks);
			if (!perkConfig.max || (perkConfig.value > 0 ? charPerkValue < perkConfig.max : charPerkValue > perkConfig.max)) {
				newPool.push(perk);
			}
		});
		
		return newPool;
	}

	public getPerkValue(perk: string, perksMap: PERK_MAP) {
		const level = perksMap[perk] || 0;
		return this.getPerkLevelValue(perk, level);
	}
	
	protected getPerkLevelValue(perk: string, level: number) {
		const perkConfig = this.getPerkConfig(perk);
		const initialValue = perkConfig.default || 0;
		const valueModifier = perkConfig.value || 1;
		return initialValue + level * valueModifier;
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

	public getDmgModifier(target: GameSocket|MOB_INSTANCE): DMG_RESULT {
		const dmgModifier = this.getAbilityPerkValue(talentsConfig.PERKS.DMG_MODIFIER_KEY, target);
		let modifier = dmgModifier;
		const critActivated = this.isAbilityActivated(talentsConfig.PERKS.CRIT_CHANCE, target);
		if (critActivated) {
			const critModifier = this.getAbilityPerkValue(talentsConfig.PERKS.CRIT_MODIFIER_KEY, target);
			modifier *= critModifier;
		}
		return {dmg: modifier, crit: critActivated};
	}

	public getThreatModifier(socket: GameSocket): number {
		const threatModifier = this.getAbilityPerkValue(talentsConfig.PERKS.THREAT_MODIFIER_KEY, socket);
		return threatModifier;
	}

	public getDefenceModifier(target: GameSocket|MOB_INSTANCE): number {
		const isBlock = this.isAbilityActivated(talentsConfig.PERKS.BLOCK_CHANCE, target);
		let defenceModifier = 0; // complete block
		if (!isBlock) {
			let dmgReduction = this.getAbilityPerkValue(talentsConfig.PERKS.DAMAGE_REDUCTION, target);
			defenceModifier = 1 - dmgReduction;
		}
		return defenceModifier;
	}
	
	public getHpRegenModifier(socket: GameSocket): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.HP_REGEN_MODIFIER, socket);
	}
	
	public getMpRegenModifier(socket: GameSocket): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_REGEN_MODIFIER, socket);
	}
	
	public getHpRegenInterval(socket: GameSocket): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.HP_REGEN_INTERVAL, socket) * 1000;
	}
	
	public getMpRegenInterval(socket: GameSocket): number {
		return this.getAbilityPerkValue(talentsConfig.PERKS.MP_REGEN_INTERVAL, socket) * 1000;
	}
	
	public isAbilityActivated(perk: string, target: GameSocket|MOB_INSTANCE): boolean {
		const value = this.getAbilityPerkValue(perk, target);
		const activated = doesChanceWorkFloat(value);
		return activated;
	}
	
	public getAbilityPerkValue(perk: string, target: GameSocket|MOB_INSTANCE): number {
		return typeof (<MOB_INSTANCE>target).mobId === "undefined" 
			? this.getCharPerkValue(perk, <GameSocket>target)
			: this.getMobPerkValue(perk, <MOB_INSTANCE>target); 
	}
	
	protected getCharPerkValue(perk: string, socket: GameSocket): number {
		const ability = socket.character.stats.primaryAbility;
		const charPerks = socket.character.talents._doc[ability].perks;
		let perkValue = this.getPerkValue(perk, charPerks);
		if (socket.currentSpell) {
			// send the higher value - perk or spell
			let spellPerkValue = socket.currentSpell.perks[perk] || 0;
			perkValue = Math.max(spellPerkValue, perkValue);
		}
		return perkValue;
	}

	protected getMobPerkValue(perk: string, mob: MOB_INSTANCE): number {
		// get the perk if exists, otherwise get its default
		let perkValue = (mob.perks || {})[perk] || this.getPerkLevelValue(perk, 0);
		
		if (mob.currentSpell) {
			// send the higher value - perk or spell
			let spellPerkValue = mob.currentSpell[perk] || 0;
			perkValue = Math.max(spellPerkValue, perkValue);
		}
		
		return perkValue;
	}

	public getBleedDmg(dmg: number): number {
		return Math.max(dmg * talentsConfig.PERKS.BLEED_DMG_MODIFIER | 0, 1);
	}

	public getSpell(socket: GameSocket, spellKey: string): ABILITY_SPELL_MODEL|undefined {
		const ability = socket.character.stats.primaryAbility;
		return this.spellsInfo.get(ability).get(spellKey);
	}

	public canUseSpell(socket: GameSocket, spell: ABILITY_SPELL_MODEL): boolean {
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
		return talent.lvl >= spell.lvl;
	}

	public getStealValue(value, percent): number {
		return value * percent | 0;
	}

	public getMobSpellRestTime(): number {
		return _.random(4000, 10000);
	}

	public getMobSpellUsed(mob: MOB_INSTANCE): string {
		return <any>_.sample(Object.keys(mob.spells), 1)[0];
	}

	public getTalentInfo(ability: string): TALENT_INFO|undefined {
		return this.abilitiesInfo.get(ability);
	}

	public addAbility(socket: GameSocket, ability: string) {
		socket.character.talents._doc[ability] = this.getEmptyCharAbility(ability);
		this.markAbilityModified(socket);
	}

    // HTTP functions
	// =================
    public generateTalents(talents: any[], perkCollection: any[]): Promise<any> {
		console.log("Generating talents from data:", talents);
		
		let models = [];

		(talents || []).forEach(talent => {
			let talentchema: TALENT_MODEL = {
				ability: talent.primaryAbility,
				perks: [],
				spells: [],
				info: {
					stat: talent.mainStat,
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
				talentchema.perks.push(perkSchema);
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
				talentchema.spells.push(spellSchema);
			});
			
			(talent.initialPerks || []).forEach(perk => {
				talentchema.info.initPerks[perk.key] = +perk.value;
			});

			if (talent.manaCost > 0) {
				talentchema.info.mp = +talent.manaCost;
			}

			let talentModel = new this.Model(talentchema);
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
			if (perk.max) {
				perkModel.max = +perk.max;
			}
			if (perk.default) {
				perkModel.default = +perk.default;
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
		mobSchema.spells[spell.key] = {};
		spell.perks.forEach(perk => {
			mobSchema.spells[spell.key][perk.key] = +perk.value;
		});
	});
}

export function getTalent(socket: GameSocket, ability: string): CHAR_ABILITY_TALENT {
	return socket.character.talents._doc[ability];
}

export function hasAbility(socket: GameSocket, ability: string): boolean {
	return !!getTalent(socket, ability);
}