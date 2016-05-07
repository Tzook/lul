'use strict';
let expect = require("chai").expect,
	SocketioMiddleware = require("../../lib/socketio/socketio.middleware.js"),
	SocketioServicesMock = require("./mocks/socketio.services.mock.js"),
	SocketioDataMock = new (require("./mocks/socketio.data.mock.js"))(),
	LOGS = require("../../lib/socketio/socketio.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new SocketioMiddleware();
services = new SocketioServicesMock();
middleware.init({services, config: {LOGS}});