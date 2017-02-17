'use strict';
import MasterMiddleware from '../master/master.middleware';

export default class CombatMiddleware extends MasterMiddleware {
    getValidLoad(load): number {
        return load >= 1 && load <= 100 ? (load | 0) : 1;
    }
};