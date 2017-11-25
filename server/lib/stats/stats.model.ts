
import MasterModel from '../master/master.model';
import StatsServices from './stats.services';
import * as _ from 'underscore';
import config from './stats.config';
import { PRIORITY_CHAR } from '../character/character.model';
import { EQUIPS_SCHEMA } from '../equips/equips.model';

const BAR_SCHEMA = {
    now: Number,
    total: Number,
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
    abilities: [config.ABILITY_MELEE],
    primaryAbility: config.ABILITY_MELEE
};

export const PRIORITY_STATS = PRIORITY_CHAR + 10;

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
        return PRIORITY_STATS;
    }

    createModel() {
        this.setModel("Stats");
        this.addToSchema("Character", { stats: this.getModel().schema });

        this.listenForFieldAddition("Character", "stats");
        return Promise.resolve();
    }

    protected addFieldToModel(field, data, obj: Char, reqBody) {
        data = _.clone(STATS_SCHEMA);

        let str = +reqBody.str;
        let mag = +reqBody.mag;
        let dex = +reqBody.dex;
        if (str > 0 && mag > 0 && dex > 0 && str + mag + dex == config.BEGIN_STATS_SUM) {
            data.str = str;
            data.mag = mag;
            data.dex = dex;
        }

        let bonusHp = 0;
        for (let type in EQUIPS_SCHEMA) {
            let equip = obj.equips[type];
            bonusHp += (equip.hp || 0) + this.services.strToHp(equip.str || 0);
        }

        data.hp.now = data.hp.total = this.services.strToHp(data.str);
        data.hp.now += bonusHp;
        data.mp.now = data.mp.total = this.services.magToMp(data.mag);

        obj[field] = data;
    }
};