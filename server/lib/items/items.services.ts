'use strict';
import MasterServices from '../master/master.services';
import { ITEM_STATS_SCHEMA, REQUIRE_SCHEMA } from "./items.model";
import * as _ from 'underscore';

export default class ItemsServices extends MasterServices {
	private itemsInfo: Map<string, ITEM_MODEL> = new Map();

    public generateItems(items: any[]): Promise<any> {
		console.log("Generating items from data:", items);
		
		let models = [];

		(items || []).forEach(item => {
			let itemSchema: ITEM_MODEL = {
				key: item.key,
				type: item.type,
				gold: item.goldValue,
				chance: item.dropChance,
				cap: item.stackCap,
			};

			this.pushStats(itemSchema, item, "req", REQUIRE_SCHEMA);
			this.pushStats(itemSchema, item, "stats", ITEM_STATS_SCHEMA);

			let itemModel = new this.Model(itemSchema);
			models.push(itemModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(models));
	}

	protected pushStats(itemSchema: ITEM_MODEL, item, key: string, schema) {
		let stats = {};
		let itemStats = item[key];
		for (var stat in schema) {
			if (itemStats && itemStats[stat] > 0) {
				stats[stat] = itemStats[stat];
			}
		}
		if (!_.isEmpty(stats)) {
			itemSchema[key] = stats;
		}
	}

    public getItems(): Promise<Map<string, ITEM_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: ITEM_MODEL[]) => {
				docs.forEach(doc => {
					this.itemsInfo.set(doc.key, doc);
				});
				console.log("got items");
				return this.itemsInfo;
			});
	}

	public getItemInfo(key: string): ITEM_MODEL|undefined {
		return this.itemsInfo.get(key);
	}

	public getItemInstance(key: string): ITEM_INSTANCE|undefined {
		// always return a copy of the item, so it can be modified freely
		let itemInfo = this.getItemInfo(key);
		let instance: ITEM_INSTANCE;
		if (itemInfo) {
			instance = {
				key: itemInfo.key
			};
			if (itemInfo.stats) {
				for (var statKey in itemInfo.stats) {
					instance[statKey] = itemInfo.stats[statKey];
				}
			}
		}
		return instance
	}
};