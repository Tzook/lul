'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const _ = require("underscore");
let config = require('../../../server/lib/stats/stats.config.json');
const BAR_SCHEMA = {
    now: Number,
    total: Number,
    regen: Number,
};
exports.BASE_STATS_SCHEMA = {
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
    primaryAbility: config.ABILITY_MELEE
};
class StatsModel extends master_model_1.default {
    init(files, app) {
        this.services = files.services;
        this.hasId = false;
        this.schema = _.clone(STATS_SCHEMA);
        for (let i in this.schema) {
            this.schema[i] = this.getSchemaType(this.schema[i]);
        }
    }
    getSchemaType(schema) {
        let type;
        if (typeof schema === "number") {
            type = Number;
        }
        else if (typeof schema === "string") {
            type = String;
        }
        else {
            if (Array.isArray(schema)) {
                type = [String];
            }
            else {
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
    addFieldToModel(field, data, obj, reqBody) {
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
        data.mp.regen = config.BEGIN_MP_REGEN;
        obj[field] = data;
    }
}
exports.default = StatsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3N0YXRzL3N0YXRzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZ0NBQWdDO0FBQ2hDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sVUFBVSxHQUFHO0lBQ2YsR0FBRyxFQUFFLE1BQU07SUFDWCxLQUFLLEVBQUUsTUFBTTtJQUNiLEtBQUssRUFBRSxNQUFNO0NBQ2hCLENBQUE7QUFFWSxRQUFBLGlCQUFpQixHQUFHO0lBQzdCLEdBQUcsRUFBRSxNQUFNO0lBQ1gsR0FBRyxFQUFFLE1BQU07SUFDWCxHQUFHLEVBQUUsTUFBTTtJQUNYLEVBQUUsRUFBRSxNQUFNO0lBQ1YsRUFBRSxFQUFFLE1BQU07Q0FDYixDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUc7SUFDakIsR0FBRyxFQUFFLENBQUM7SUFDTixHQUFHLEVBQUUsQ0FBQztJQUNOLEdBQUcsRUFBRSxDQUFDO0lBQ04sR0FBRyxFQUFFLENBQUM7SUFDTixHQUFHLEVBQUUsQ0FBQztJQUNOLEVBQUUsRUFBRSxFQUFFO0lBQ04sRUFBRSxFQUFFLEVBQUU7SUFDTixTQUFTLEVBQUUsTUFBTSxDQUFDLGVBQWU7SUFDakMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxhQUFhO0NBQ3ZDLENBQUE7QUFFRCxnQkFBZ0MsU0FBUSxzQkFBVztJQUcvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBDLEdBQUcsQ0FBQyxDQUFDLElBQUks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