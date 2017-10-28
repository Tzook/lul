import MasterServices from '../master/master.services';

export default class TalentsServices extends MasterServices {
	private talentsInfo: Map<string, TALENT_MODEL> = new Map();

    public generateTalents(talents: any[]): Promise<any> {
		console.log("Generating talents from data:", talents);
		
		let models = [];

		(talents || []).forEach(talent => {
			let talentschema: TALENT_MODEL = {
				key: talent.key,
				maxPoints: talent.maxPoints,
				requiredJob: talent.requiredJob,
			};

			let requiredTalents = {};
			(talent.requiredTalents || []).forEach(requiredTalent => {
				requiredTalents[requiredTalent.key] = requiredTalent.points;
				talentschema.requiredTalents = requiredTalents;
			});

			let talentModel = new this.Model(talentschema);
			models.push(talentModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(models));
	}

    public getTalents(): Promise<Map<string, TALENT_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: TALENT_MODEL[]) => {
				docs.forEach(doc => {
					this.talentsInfo.set(doc.key, doc);
				});
				console.log("got talents");
				return this.talentsInfo;
			});
	}
};