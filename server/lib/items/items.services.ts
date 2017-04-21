'use strict';
import MasterServices from '../master/master.services';

export default class ItemsServices extends MasterServices {
	private itemsInfo: Map<string, ITEM_MODEL> = new Map();

    public generateItems(items: any[]): Promise<any> {
		console.log("Generating items from data:", items);
		
		let models = [];

		(items || []).forEach(item => {
			let itemSchema: ITEM_MODEL = {
				key: item.key,
				type: item.type,
			};

			let itemModel = new this.Model(itemSchema);
			models.push(itemModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(models));
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
		// always return a copy of the item, so it can be modified freely
		return Object.assign({}, this.itemsInfo.get(key));
	}    
};