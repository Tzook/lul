
import MasterModel from '../master/master.model';
import { PRIORITY_MOBS } from '../mobs/mobs.model';

export const PRIOTIY_DROPS = PRIORITY_MOBS + 10;

export default class DropsModel extends MasterModel {
    
    init(files, app) {
        this.hasId = false;
        this.schema = {
            key: String,
            minStack: Number,
            maxStack: Number,
        };
    }

    get priority() {
        return PRIOTIY_DROPS;
    }

    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", {drops: [this.model.schema]});
        return Promise.resolve();
    }
};