'use strict';
let expect = require("chai").expect,
	MovementMiddleware = require("../../lib/movement/movement.middleware.js"),
	MovementServicesMock = require("./mocks/movement.services.mock.js"),
	MovementDataMock = new (require("./mocks/movement.data.mock.js"))(),
	LOGS = require("../../lib/movement/movement.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new MovementMiddleware();
services = new MovementServicesMock();
middleware.init({services, config: {LOGS}});