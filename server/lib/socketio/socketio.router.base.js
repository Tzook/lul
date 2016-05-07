'use strict';
let RouterBase		 = require('../master/master.router.js');

/**
 * Socketio's router
 */
class SocketioRouterBase extends RouterBase {	
	/**
	 * Initializes the instance
	 */
	init(files, app) {
		super.init(files, app);
		this.io = app.socketio;
		this.CLIENT_GETS = files.config.CLIENT_GETS;
		this.SERVER_GETS = files.config.SERVER_GETS;
	}
	
	get connection() {
		return 'socketio';
	}
}

module.exports = SocketioRouterBase;