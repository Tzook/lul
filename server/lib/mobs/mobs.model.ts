
import MasterModel from '../master/master.model';
import MobsController from './mobs.controller';
import { PRIORITY_ITEM } from '../items/items.model';
import _ = require('underscore');

const MOB_SCHEMA = {
    mobId: String, 
    name: String,
    hp: Number,
    lvl: Number,
    exp: Number,
    dmg: Number,
};

const ITEM_SCHEMA_ADDITION = {
    mobsDrop: {
        minLvl: Number,
        maxLvl: Number,
        minStack: Number,
        maxStack: Number,
    }
}

export const PRIORITY_MOBS = PRIORITY_ITEM + 10;

export default class MobsModel extends MasterModel {
	protected controller: MobsController;
    
    init(files, app) {
        this.controller = files.controller;

        this.schema = Object.assign({}, MOB_SCHEMA);
        this.listenForSchemaAddition('Mobs');
    }

    get priority() {
        return PRIORITY_MOBS;
    }

    createModel() {

        this.setModel('Mobs');

        this.addToSchema("Item", ITEM_SCHEMA_ADDITION);

		setTimeout(() => this.controller.warmMobsInfo()); // timeout so the Model can be set
        this.removeListen('Mobs');
        return Promise.resolve();
    }
};

export function extendItemWithMobs(item, itemSchema: ITEM_MODEL) {
    let mobsDrop: ITEM_MOBS_DROP = {};
    if (item.minLvlMobs > 0) {
        mobsDrop.minLvl = +item.minLvlMobs;
    }
    if (item.maxLvlMobs > 0) {
        mobsDrop.maxLvl = +item.maxLvlMobs;
    }
    if (item.minMobsStack > 1) {
        mobsDrop.minStack = +item.minMobsStack;
    }
    if (item.maxMobsStack > 1) {
        mobsDrop.maxStack = +item.maxMobsStack;
    }
    if (!_.isEmpty(mobsDrop)) {
        itemSchema.mobsDrop = mobsDrop;
    }
}
