'use strict';
import MasterMiddleware from '../master/master.middleware';
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;

export default class RoomsMiddleware extends MasterMiddleware {

    public canEnterRoom(wantedRoom: string, currentRoom: string) {
        return ROOMS_MAP[currentRoom].indexOf(wantedRoom) !== -1;
    }
};