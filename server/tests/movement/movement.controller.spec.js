'use strict';
let expect = require("chai").expect,
	MovementController = require("../../lib/movement/movement.controller.js"),
	MovementServicesMock = require("./mocks/movement.services.mock.js"),
	MovementDataMock = new (require("./mocks/movement.data.mock.js"))(),
	LOGS = require("../../lib/movement/movement.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new MovementController();
services = new MovementServicesMock();
controller.init({services, config: {LOGS}});