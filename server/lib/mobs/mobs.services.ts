'use strict';
import MasterServices from '../master/master.services';
import * as _ from "underscore";

export default class MobsServices extends MasterServices {
	private mobsInfo: Map<string, MOB_MODEL> = new Map();

	public generateMobs(mobs: any[]): Promise<any> {
		console.log("Generating mobs from data:", mobs);
		
		let mobModels = [];

		(mobs || []).forEach(mob => {
			let mobId = mob.key;

			let drops = [];
			(mob.drops || []).forEach(drop => {
				let { key, minStack, maxStack } = drop;
				if (minStack >= 1 && maxStack > 1) {
					drops.push({ key, minStack, maxStack });
				} else {
					drops.push({ key });
				}
			});

			let mobSchema: MOB_MODEL = {
				mobId,
				hp: mob.hp,
				lvl: mob.level,
				exp: mob.exp,
				minDmg: mob.minDMG,
				maxDmg: mob.maxDMG,
				drops,
			};

			let mobModel = new this.Model(mobSchema);
			mobModels.push(mobModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(mobModels));
	}

	public getMobs(): Promise<Map<string, MOB_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: MOB_MODEL[]) => {
				docs.forEach(doc => {
					this.mobsInfo.set(doc.mobId, doc);
				});
				console.log("got mobs");
				return this.mobsInfo;
			});
	}

	public getMobInfo(mobId: string): MOB_MODEL {
		// always return a copy of the mob, so it can be modified freely
		return Object.assign({}, this.mobsInfo.get(mobId));
	}

	public getMobRoomId(room: string, mobId: string): string {
		return `${room}-${mobId}`;
	}

	public getDamageRange(min: number, max: number): number {
		return _.random(Math.floor(min) || 1, Math.floor(max));
	}

	public getHpAfterDamage(hp: number, dmg: number): number {
		return Math.max(0, Math.floor(hp - dmg));
	}
};