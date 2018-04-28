
import MasterModel from '../master/master.model';
import StatsServices from './stats.services';
import * as _ from 'underscore';
import config from './stats.config';
import { PRIORITY_CHAR } from '../character/character.model';

const BAR_SCHEMA = {
    now: Number,
    total: Number,
}

export const BASE_STATS_SCHEMA = {
    hp: Number,
    mp: Number,
};

const STATS_SCHEMA = {
    lvl: 1,
    exp: 0,
    hp: {},
    mp: {},
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
        const statsSchema: any = _.clone(STATS_SCHEMA);

        statsSchema.hp.now = statsSchema.hp.total = 20;
        statsSchema.mp.now = statsSchema.mp.total = 20;

        obj[field] = statsSchema;
		this.addFields(obj, reqBody);
    }
};