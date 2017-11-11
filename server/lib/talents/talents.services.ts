import MasterServices from '../master/master.services';

export default class TalentsServices extends MasterServices {
	private talentsInfo: Map<string, TALENT_MODEL> = new Map();

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

		return this.Model.remove({})
			.then(d => this.Model.create(models));
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