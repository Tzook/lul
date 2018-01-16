import MasterModel from '../master/master.model';
import { PRIORITY_ITEM } from '../items/items.model';

export const PRIORITY_USE = PRIORITY_ITEM + 10;

export const USE_SCHEMA = {
    hp: Number,
    mp: Number,
};

export default class UseModel extends MasterModel {
    get priority() {
        return PRIORITY_USE;
    }

    createModel() {
        this.addToSchema("Item", {use: USE_SCHEMA});
        
        return Promise.resolve();
    }
};