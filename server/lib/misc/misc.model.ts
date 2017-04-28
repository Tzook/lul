"use strict";
import MasterModel from "../master/master.model";

export default class MiscModel extends MasterModel {
    
    get priority() {
        return 20;
    }

    createModel() {
        return Promise.resolve();
    }
};