'use strict';
import MasterMiddleware from '../master/master.middleware';

export default class RoomsMiddleware extends MasterMiddleware {
    public getPublicCharInfo(char: Char): PublicChar {
        let {name, position, equips, stats, looks} = char;
        return {name, position, equips, stats, looks};
    }
};