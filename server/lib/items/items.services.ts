'use strict';
import MasterServices from '../master/master.services';

export default class ItemsServices extends MasterServices {
	private itemsInfo: Map<string, ITEM_SCHEMA> = new Map();

    public generateItems(items: any[]): Promise<any> {
		console.log("Generating items from data:", items);
		
		let models = [];

		(items || []).forEach(item => {
			let itemSchema: ITEM_SCHEMA = {
				key: item.key,
				type: item.type,
			};

			let itemModel = new this.Model(itemSchema);
			models.push(itemModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(models));
	}

    public getItems(): Promise<Map<string, ITEM_SCHEMA>> {
		return this.Model.find({}).lean()
			.then((docs: ITEM_SCHEMA[]) => {
				docs.forEach(doc => {
					this.itemsInfo.set(doc.key, doc);
				});
				console.log("got items");
				return this.itemsInfo;
			});
	}
};