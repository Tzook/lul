"use strict";
import MasterModel from "../master/master.model";
import ItemsController from './items.controller';
let config = require('../../../server/lib/items/items.config.json');

export const ITEM_SCHEMA = {
    key: String,
    type: String,
};

export default class ItemsModel extends MasterModel {
    protected controller: ItemsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = ITEM_SCHEMA;
    }

    get priority() {
        return 25;
    }

    createModel() {
        this.setModel("Item");
        this.addToSchema("Character", {items: [this.getModel().schema]});
        let items = [
			// new this.model(EQUIPS.WEP.ELD),
            // new this.model(EQUIPS.CHEST.LTHR),
            // new this.model(EQUIPS.CHEST.ADV),
            // new this.model(EQUIPS.GLOVE.BLK),
            // new this.model(EQUIPS.LEG.CLTH),
            // new this.model(EQUIPS.LEG.GRN),
            // new this.model(EQUIPS.SHOE.LTHR),
            // new this.model(EQUIPS.SHOE.STRP),
		];
        for (var i = items.length; i < config.MAX_ITEMS; i++) {
            items[i] = new this.model({});
        }
        this.listenForFieldAddition("Character", "items", items);
        setTimeout(() => this.controller.warmItemsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};