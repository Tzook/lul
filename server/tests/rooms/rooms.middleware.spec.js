'use strict';
let expect = require("chai").expect,
	RoomsMiddleware = require("../../lib/rooms/rooms.middleware.js"),
	RoomsServicesMock = require("./mocks/rooms.services.mock.js"),
	RoomsDataMock = new (require("./mocks/rooms.data.mock.js"))(),
	LOGS = require("../../lib/rooms/rooms.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new RoomsMiddleware();
services = new RoomsServicesMock();
middleware.init({services, config: {LOGS}});