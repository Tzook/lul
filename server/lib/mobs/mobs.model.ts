
import MasterModel from '../master/master.model';
import MobsController from './mobs.controller';
import { PRIORITY_ITEM } from '../items/items.model';

const MOB_SCHEMA = {
    mobId: String, 
    name: String,
    hp: Number,
    lvl: Number,
    exp: Number,
    dmg: Number,
};

const ITEM_SCHEMA_ADDITION = {
    minLvlMobs: Number,
    maxLvlMobs: Number,
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
    if (item.minLvlMobs > 0) {
        itemSchema.minLvlMobs = +item.minLvlMobs;
    }
    if (item.maxLvlMobs > 0) {
        itemSchema.maxLvlMobs = +item.maxLvlMobs;
    }
}