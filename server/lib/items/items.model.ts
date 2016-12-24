"use strict";
import MasterModel from "../master/master.model";
let config = require('../../../server/lib/items/items.config.json');

export default class ItemsModel extends MasterModel {
    init(files, app) {
        this.hasId = false;

        this.schema = {
            name: String,
            icon: String,
        };
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
            items[i] = "";
        }
        this.listenForFieldAddition("Character", "items", items);
        return Promise.resolve();
    }
};