
import MasterModel from '../master/master.model';

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
        return 20;
    }

    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", {drops: [this.model.schema]});
        return Promise.resolve();
    }
};