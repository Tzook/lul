'use strict';
import MasterMiddleware from '../master/master.middleware';
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;

export default class RoomsMiddleware extends MasterMiddleware {

    public canEnterRoom(wantedRoom: string, currentRoom: string) {
        return ROOMS_MAP[currentRoom].indexOf(wantedRoom) !== -1;
    }

    public validateHasSercetKey(req, res, next) {
		let pass = process.env.generateRoomsPass ? process.env.generateRoomsPass : require('../../../config/.env.json').generateRoomsPass
		if (pass && req.body.scene && req.body.scene.pass === pass) {
			next();
		} else {
			this.sendError(res, this.LOGS.MASTER_INVALID_PARAM_TYPE, {param: 'scene.pass'})
		}
	}
};