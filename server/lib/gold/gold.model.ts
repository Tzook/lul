
import MasterModel from '../master/master.model';

export default class GoldModel extends MasterModel {
    get priority() {
        return 20;
    }

    createModel() {
        this.addToSchema("Character", { gold: {type: Number, default: 0} });
        return Promise.resolve();
    }
};