'use strict';
import MasterModel from '../master/master.model';
import MobsController from "./mobs.controller";

const MOB_SCHEMA = {
    mobId: String, 
    name: String,
    hp: Number,
    lvl: Number,
    minDmg: Number,
    maxDmg: Number,
};

export default class MobsModel extends MasterModel {
	protected controller: MobsController;
    
    init(files, app) {
        this.controller = files.controller;

        this.schema = Object.assign({}, MOB_SCHEMA);
    }

    createModel() {
        this.setModel('Mobs');

		setTimeout(() => this.controller.warmMobsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};