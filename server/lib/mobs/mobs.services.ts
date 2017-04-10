'use strict';
import MasterServices from '../master/master.services';

export default class MobsServices extends MasterServices {
	private mobsInfo: Map<string, MOB_SCHEMA> = new Map();

	public generateMobs(mobs: any[]): Promise<any> {
		console.log("Generating mob from data:", mobs);
		
		let mobModels = [];

		(mobs || []).forEach(mob => {
			let mobId = mob.key;

			let mobSchema: MOB_SCHEMA = {
				mobId,
				name: mob.name,
				hp: mob.hp,
				lvl: mob.level,
				minDmg: mob.minDMG,
				maxDmg: mob.maxDMG,
			};

			let mobModel = new this.Model(mobSchema);
			mobModels.push(mobModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(mobModels));
	}

	public getMobs(): Promise<Map<string, MOB_SCHEMA>> {
		return this.Model.find({}).lean()
			.then((docs: MOB_SCHEMA[]) => {
				docs.forEach(doc => {
					this.mobsInfo.set(doc.name, doc);
				});
				console.log("got mobs");
				return this.mobsInfo;
			});
	}

	public getMobInfo(mobId: string): MOB_SCHEMA {
		// always return a copy of the mob, so it can be modified freely
		return Object.assign({}, this.mobsInfo.get(mobId));
	}
};