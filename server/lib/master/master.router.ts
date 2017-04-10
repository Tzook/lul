'use strict';
import Logger from '../main/logger';

export default class MasterRouter {
	protected controller;
	protected middleware;
	protected ROUTES;
	protected logger: Logger;

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
};