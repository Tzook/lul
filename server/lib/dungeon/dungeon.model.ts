import MasterModel from "../master/master.model";
import * as mongoose from 'mongoose';

export const PRIORITY_DUNGEON = 10;

const DUNGEON_REWARD_MODEL = (<any>mongoose.Schema)({
    key: String,
    chance: Number,
    stack: Number,
}, {_id: false});

const DUNGEON_STAGE_MODEL = (<any>mongoose.Schema)({
    rooms: [String],
    rareRooms: [String],
    rewards: [DUNGEON_REWARD_MODEL],
}, {_id: false});

const DUNGEON_MODEL = {
    key: String,
    minLvl: Number,
    maxLvl: Number,
    time: Number,
    beginRoom: String,
    stages: [DUNGEON_STAGE_MODEL],
    perksPool: [Object],
    rareBonuses: [String],
};

export default class DungeonModel extends MasterModel {
    init(files, app) {

        this.schema = DUNGEON_MODEL;
    }

    get priority() {
        return PRIORITY_DUNGEON;
    }
    
    createModel() {
        this.setModel('Dungeon');
        return Promise.resolve();
    }
};