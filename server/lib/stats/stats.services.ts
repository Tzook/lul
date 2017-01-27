'use strict';
import MasterServices from '../master/master.services';
let config = require('../../../server/lib/stats/stats.config.json');

export default class StatsServices extends MasterServices {
    public magToMp(mag: number) {
        return mag * config.MAG_TO_MP_RATIO;
    }

    public strToHp(str: number) {
        return str * config.STR_TO_HP_RATIO;
    }
};