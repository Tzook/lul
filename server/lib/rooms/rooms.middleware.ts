'use strict';
import MasterMiddleware from '../master/master.middleware';
let ROOM_NAMES = require('../../../server/lib/rooms/rooms.config.json').ROOM_NAMES;

export default class RoomsMiddleware extends MasterMiddleware {

    public canEnterRoom(wantedRoom: string, currentRoom: string) {
        if (wantedRoom == ROOM_NAMES.DEFAULT_ROOM && currentRoom == ROOM_NAMES.NEXT_ROOM
            || wantedRoom == ROOM_NAMES.NEXT_ROOM && currentRoom == ROOM_NAMES.DEFAULT_ROOM) {
            return true;
        }
        return false;
    }
};