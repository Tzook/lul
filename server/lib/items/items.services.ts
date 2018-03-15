
import MasterServices from '../master/master.services';
import { REQUIRE_SCHEMA } from "./items.model";
import * as _ from 'underscore';
import ItemsMiddleware from './items.middleware';
import { USE_SCHEMA } from '../use/use.model';
import { extendItemSchemaWithTalents, slightlyTweakPerks } from '../talents/talents.services';

export default class ItemsServices extends MasterServices {
	private itemsInfo: Map<string, ITEM_MODEL> = new Map();
	protected middleware: ItemsMiddleware;
	
	init(files, app) {
		this.middleware = files.middleware;
		super.init(files, app);
	}

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

            extendItemSchemaWithTalents(item, itemSchema);
			this.pushStats(itemSchema, item, "req", REQUIRE_SCHEMA);
			if (this.middleware.isMisc(itemSchema)) {
				this.pushStats(itemSchema, item, "use", USE_SCHEMA);
			}

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
			if (itemInfo.perks) {
                instance.perks = slightlyTweakPerks(itemInfo.perks);
            }
		}
		return instance
	}

	public clearInvalidItems(socket: GameSocket) {
		let items = socket.character.items;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (this.middleware.isItem(item) && !this.getItemInfo(item.key)) {
				this.deleteItem(socket, i);
			}	
		}
	}

	public deleteItem(socket: GameSocket, slot: number) {
		socket.character.items.set(slot, {});
	}
};