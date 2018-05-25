import MasterModel from "../master/master.model";

export const PRIORITY_DUNGEON = 10;

export default class DungeonModel extends MasterModel {
    get priority() {
        return PRIORITY_DUNGEON;
    }
    
    createModel() {
        return Promise.resolve();
    }
};