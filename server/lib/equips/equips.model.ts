"use strict";
import MasterModel from "../master/master.model";
import * as _ from 'underscore';
import {ITEM_SCHEMA} from "../items/items.model";

export default class EquipsModel extends MasterModel {
    init(files, app) {
        this.hasId = false;

        this.schema = {
            head: ITEM_SCHEMA,
            chest: ITEM_SCHEMA,
            legs: ITEM_SCHEMA,
            gloves: ITEM_SCHEMA,
            shoes: ITEM_SCHEMA,
        };
    }

    get priority() {
        return 30;
    }

    createModel() {
        this.setModel("Equip");
        this.addToSchema("Character", {equips: this.getModel().schema});
        let equips = _.clone(this.schema);
        for (let i in equips) {
            equips[i] = {};
        }
        this.listenForFieldAddition("Character", "equips", equips);
        return Promise.resolve();
    }
};