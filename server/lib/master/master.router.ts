export default class MasterRouter {
	protected controller;
	protected middleware;
	protected ROUTES;

	init(files, app) {
		this.controller = files.controller;
		this.middleware = files.middleware;
		this.ROUTES = files.config.ROUTES;
     	this.initRoutes(app);
	}

	protected initRoutes(app) {
		// To inherit
	}

	get connection() {
		return undefined;
	}
};