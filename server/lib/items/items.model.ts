"use strict";
import MasterModel from "../master/master.model";
let config = require('../../../server/lib/items/items.config.json');

export let ITEM_SCHEMA = {
    name: String,
    icon: String,
    type: String,
};

export default class ItemsModel extends MasterModel {
    init(files, app) {
        this.hasId = false;

        this.schema = ITEM_SCHEMA;
    }

    get priority() {
        return 25;
    }

    createModel() {
        this.setModel("Item");
        this.addToSchema("Character", {items: [this.getModel().schema]});
        let items = [
			new this.model({
				name: "Sword of Elad",
				icon: "sword_of_elad"
			})
		];
        for (var i = 1; i < config.MAX_ITEMS; i++) {
            items[i] = new this.model({});
        }
        this.listenForFieldAddition("Character", "items", items);
        return Promise.resolve();
    }
};