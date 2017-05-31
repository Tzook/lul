'use strict';
import MasterModel from '../master/master.model';
import StatsServices from './stats.services';
import * as _ from 'underscore';
let config = require('../../../server/lib/stats/stats.config.json');

const BAR_SCHEMA = {
    now: Number,
    total: Number,
    regen: Number,
}

export const BASE_STATS_SCHEMA = {
    str: Number,
    mag: Number,
    dex: Number,
    hp: Number,
    mp: Number,
};

const STATS_SCHEMA = {
    str: 3,
    mag: 2,
    dex: 2,
    lvl: 1,
    exp: 0,
    hp: {},
    mp: {},
    abilities: config.BEGIN_ABILITIES,
    primaryAbility: config.ABILITY_MEELE
}

export default class StatsModel extends MasterModel {
    protected services: StatsServices;

    init(files, app) {
        this.services = files.services;
        this.hasId = false;
        this.schema = _.clone(STATS_SCHEMA);

        for (let i in this.schema) {
            this.schema[i] = this.getSchemaType(this.schema[i]);
        }
    }

    private getSchemaType(schema) {
        let type;
        if (typeof schema === "number") {
            type = Number;
        } else if (typeof schema === "string") {
            type = String;
        } else {
            if (Array.isArray(schema)) {
                type = [String];
            } else {
                type = BAR_SCHEMA;
            }
        }
        return type;
    }

    get priority() {
        return 35;
    }

    createModel() {
        this.setModel("Stats");
        this.addToSchema("Character", { stats: this.getModel().schema });

        this.listenForFieldAddition("Character", "stats");
        return Promise.resolve();
    }

    protected addFieldToModel(field, data, obj, reqBody) {
        data = _.clone(STATS_SCHEMA);

        let str = +reqBody.str;
        let mag = +reqBody.mag;
        let dex = +reqBody.dex;
        if (str > 0 && mag > 0 && dex > 0 && str + mag + dex == config.BEGIN_STATS_SUM) {
            data.str = str;
            data.mag = mag;
            data.dex = dex;
        }
        data.hp.now = data.hp.total = this.services.strToHp(data.str);
        data.mp.now = data.mp.total = this.services.magToMp(data.mag);
        data.hp.regen = config.BEGIN_HP_REGEN;
        data.mp.regen = config.BEGIN_MP_REGEN

        obj[field] = data;
    }
};