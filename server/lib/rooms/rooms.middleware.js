'use strict';
let MiddlewareBase = require('../master/master.middleware.js');

/**
 * Rooms's middleware
 */
class RoomsMiddleware extends MiddlewareBase {
	checkIfUserIsInRoom (res, req, next) {
		let rooms = (req.user) ? req.user.rooms : [],
			roomName = req.params.roomName;
		if (rooms && rooms.length === 0 || rooms.indexOf(roomName) === -1) 
			this.sendError(res, this.LOGS.LEAVE_ROOM_FAILURE_USER_NOT_IN_ROOM, {room: roomName});
		// NOAM, we (should..) always use curly braces on ifs and loops. delete comment
		next();
	}	
}

module.exports = RoomsMiddleware;