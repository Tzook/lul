
import MasterModel from '../master/master.model';
import { PRIORITY_CHAR } from '../character/character.model';

export const PRIORITY_GOLD = PRIORITY_CHAR + 10;

export default class GoldModel extends MasterModel {
    get priority() {
        return PRIORITY_GOLD;
    }

    createModel() {
        this.addToSchema("Character", { gold: {type: Number, default: 0} });
        return Promise.resolve();
    }
};