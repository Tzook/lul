'use strict';
let expect = require("chai").expect,
	RoomsController = require("../../lib/rooms/rooms.controller.js"),
	RoomsServicesMock = require("./mocks/rooms.services.mock.js"),
	RoomsDataMock = new (require("./mocks/rooms.data.mock.js"))(),
	LOGS = require("../../lib/rooms/rooms.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new RoomsController();
services = new RoomsServicesMock();
controller.init({services, config: {LOGS}});