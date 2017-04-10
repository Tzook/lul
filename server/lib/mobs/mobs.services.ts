'use strict';
import MasterServices from '../master/master.services';

export default class MobsServices extends MasterServices {
	private mobsInfo: Map<string, MOB_SCHEMA> = new Map();

	public generateMob (data): Promise<any> {
		console.log("Generating mob from data:", data);
		
		let mobId = data.key;

        let mob: MOB_SCHEMA = {
    		mobId,
    		name: data.name,
    		hp: data.hp,
    		lvl: data.level,
    		dmg: data.damage,
        };

		let mobModel = new this.Model(mob);
		
		return this.Model.findOneAndUpdate({mobId}, mobModel, {new: true, upsert: true});
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

	public getMobInfo(mobId: string): MOB_SCHEMA|{} {
		// always return a copy of the mob, so it can be modified freely
		return Object.assign({}, this.mobsInfo.get(mobId));
	}
};