import MasterServices from '../master/master.services';
import SocketioRouter from '../socketio/socketio.router';
import * as _ from 'underscore';

export default class TalentsServices extends MasterServices {
	private talentsInfo: Map<string, ABILITY_PERK_INSTANCE[]> = new Map();

	protected socketioRouter: SocketioRouter;
	
	init(files, app) {
		super.init(files, app);
		this.socketioRouter = files.routers.socketio;
	}

	public getEmptyCharAbility(): CHAR_ABILITY_TALENT {
		return {
			lvl: 1,
			exp: 0,
			points: 0,
			pool: [],
			perks: {},
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
		let abilityInfo = this.talentsInfo.get(ability);
		// if surpass max info - reset it
		if (poolLvl > abilityInfo.length - 1) {
			poolLvl = abilityInfo.length - 1;
		}
		const perkInstance = abilityInfo[poolLvl];
		let pool = this.filterPool(perkInstance.pool, talent.perks);
		pool = this.pickPool(pool, perkInstance.perksOffered);
		return pool;
	}
	
	protected filterPool(pool: string[], perks: CHAR_ABILITY_PERKS): string[] {
		const config = this.socketioRouter.getConfig();
		let newPool = [];
		pool.forEach(perk => {
			let points = perks[perk] || 0;
			let perkConfig: any = config.perks[perk] || {};
			if (!(points >= perkConfig.max)) {
				newPool.push(perk);
			}
		});
		
		return newPool;
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

    // HTTP functions
	// =================
    public generateTalents(talents: any[], perkCollection: any[]): Promise<any> {
		console.log("Generating talents from data:", talents);
		
		let models = [];

		(talents || []).forEach(talent => {
			let talentchema: TALENT_MODEL = {
				ability: talent.primaryAbility,
				perks: [],
			};

			(talent.perks || []).forEach(perk => {
				let perkSchema = {
					atLeastLvl: perk.atLeastLvl,
					perksOffered: perk.perksOffered,
					addToPool: perk.addToPool,
				};
				talentchema.perks.push(perkSchema);
			});

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
					this.talentsInfo.set(doc.ability, perksArray);
				});
				console.log("got talents");
				return this.talentsInfo;
			});
		}
		
		protected getLvlPerksArray(perks = []) {
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