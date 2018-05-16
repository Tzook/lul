
import MasterModel from '../master/master.model';

export default class CombatModel extends MasterModel {
    createModel() {
        this.addToSchema("Rooms", {pvp: Boolean});
        
        return Promise.resolve();
    }
};