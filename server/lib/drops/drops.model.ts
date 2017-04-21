"use strict";
import MasterModel from "../master/master.model";

export const DROP_SCHEMA = {
    key: String,
    chance: String,
};

export default class DropsModel extends MasterModel {
    init(files, app) {
        this.schema = DROP_SCHEMA;
    }

    get priority() {
        return 20;
    }

    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", {drops: [this.getModel().schema]});
        return Promise.resolve();
    }
};