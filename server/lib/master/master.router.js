'use strict';

/**
 * Base router
 */
class RouterBase {
	/**
	 * Initializes the instance
	 */
	init(files, app) {
		this.controller = files.controller;
		this.middleware = files.middleware;
		this.ROUTES = files.config.ROUTES;
		this.logger = app.logger;
     	this.initRoutes(app);
	}
	
	initRoutes(app) {
		// TODO inherit
	}
	
	get connection() {
		return undefined;
	}
	setConnection(con) {
		// TODO inherit
	}
}

module.exports = RouterBase;