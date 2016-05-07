'use strict';
let RouterBase = require('../master/master.router.js');

/**
 * Rooms's router
 */
class RoomsRouter extends RouterBase {	
	initRoutes(app) {
		app.get(this.ROUTES.JOIN_ROOM, this.controller.joinRoom); // room does not exist will create it
		app.get(this.ROUTES.LEAVE_ROOM, this.middleware.checkIfUserIsInRoom, this.controller.leaveRoom); // room does not exist will return error
		// NOAM, look at user.router.js to see how to structure the routes, it is much more readable that way.
		// also, dont forget to use the .bind(this.controller) and .bind(this.middleware)!
		// when done, delete these comments  
	}
}

module.exports = RoomsRouter;