'use strict';
import MasterServices from '../master/master.services';
let config = require('../../../server/lib/stats/stats.config.json');
import * as _ from 'underscore';

export default class StatsServices extends MasterServices {
    public magToMp(mag: number) {
        return mag * config.MAG_TO_MP_RATIO;
    }

    public strToHp(str: number) {
        return str * config.STR_TO_HP_RATIO;
    }

    public getExp(level: number) {
        return Math.round(this.getAbsoluteExp(level + 1) - this.getAbsoluteExp(level));
    }

    protected getAbsoluteExp(a: number) {
        // see http://tibia.wikia.com/wiki/Experience_Formula
        return (50 / 3) * (a * a * a - 6 * a * a + 17 * a - 12);
    }
};
StatsServices.prototype.getExp = <any>_.memoize(StatsServices.prototype.getExp);