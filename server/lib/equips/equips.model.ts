"use strict";
import MasterModel from "../master/master.model";
import * as _ from 'underscore';
import {ITEM_SCHEMA} from "../items/items.model";

export const EQUIPS_SCHEMA = {
    head: ITEM_SCHEMA,
    chest: ITEM_SCHEMA,
    legs: ITEM_SCHEMA,
    gloves: ITEM_SCHEMA,
    shoes: ITEM_SCHEMA,
};

export default class EquipsModel extends MasterModel {
    init(files, app) {
        this.hasId = false;
        this.schema = _.clone(EQUIPS_SCHEMA);
        for (let i in this.schema) {
            this.schema[i] = this.mongoose.Schema.Types.Mixed;
        }
    }

    get priority() {
        return 20;
    }

    createModel() {
        this.setModel("Equip");
        this.addToSchema("Character", {equips: this.getModel().schema});
        let equips = _.clone(EQUIPS_SCHEMA);
        let ItemModel = this.getModel("Item");
        for (let i in equips) {
            equips[i] = new ItemModel({});
        }
        equips["chest"] = new ItemModel({
            name: "Chest of Elad",
            icon: "chest_of_elad",
            type: "chest"
        });

        this.listenForFieldAddition("Character", "equips", equips);
        return Promise.resolve();
    }
};