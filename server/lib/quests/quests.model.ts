
import MasterModel from '../master/master.model';
import QuestsController from './quests.controller';
import * as mongoose from 'mongoose';
import { BASE_STATS_SCHEMA } from "../stats/stats.model";

const QUEST_SCHEMA = {
    key: String,
    cond: {
        loot: mongoose.Schema.Types.Mixed,
        hunt: mongoose.Schema.Types.Mixed,
    },
    req: {
        class: String,
        lvl: Number,
        quests: mongoose.Schema.Types.Mixed
    },
    reward: {
        items: mongoose.Schema.Types.Mixed,
        class: String,
        exp: Number,
        stats: BASE_STATS_SCHEMA,
        ability: String
    }
};

const CHAR_QUESTS = {
    progress: {},
    done: {},
    hunt: {},
};

export default class QuestsModel extends MasterModel {
    protected controller: QuestsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = QUEST_SCHEMA;
        this.minimize = true;
    }

    get priority() {
        return 35;
    }

    createModel() {
        this.setModel("Quest");

        let CharQuestModel = this.createNewModel("CharQuest", CHAR_QUESTS, {_id: false, strict: false, minimize: false});
        this.addToSchema("Character", {quests: CharQuestModel.schema});
        this.listenForFieldAddition("Character", "quests", CHAR_QUESTS);

        setTimeout(() => this.controller.warmQuestsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};