"use strict";
import MasterModel from "../master/master.model";

export default class DropsModel extends MasterModel {
    
    get priority() {
        return 20;
    }

    createModel() {
        this.addToSchema("Mobs", {drops: [String]});
        return Promise.resolve();
    }
};