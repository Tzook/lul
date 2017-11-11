import MasterServices from '../master/master.services';
import SocketioRouter from '../socketio/socketio.router';

export default class TalentsServices extends MasterServices {
	private talentsInfo: Map<string, TALENT_MODEL> = new Map();

	protected socketioRouter: SocketioRouter;
	
	init(files, app) {
		super.init(files, app);
		this.socketioRouter = files.routers.socketio;
	}

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
				value: perk.value,
			};
			if (perk.max) {
				perkModel.max = perk.max;
			}
			if (perk.default) {
				perkModel.default = perk.default;
			}
			perks[perk.key] = perkModel;
		});

		config.perks = perks;
		return config.save();
	}

    public getTalents(): Promise<Map<string, TALENT_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: TALENT_MODEL[]) => {
				docs.forEach(doc => {
					this.talentsInfo.set(doc.ability, doc);
				});
				console.log("got talents");
				return this.talentsInfo;
			});
	}
};