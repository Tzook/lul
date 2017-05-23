'use strict';
import MasterModel from '../master/master.model';
import QuestsController from "./quests.controller";
import * as mongoose from 'mongoose';

const QUEST_SCHEMA = {
    key: String,
    cond: mongoose.Schema.Types.Mixed,
    req: {
        class: String,
        lvl: Number,
        quests: mongoose.Schema.Types.Mixed
    },
    reward: {
        items: mongoose.Schema.Types.Mixed,
        class: String,
        exp: Number,
    }
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

        setTimeout(() => this.controller.warmQuestsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};