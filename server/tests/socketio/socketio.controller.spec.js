'use strict';
let expect = require("chai").expect,
	SocketioController = require("../../lib/socketio/socketio.controller.js"),
	SocketioServicesMock = require("./mocks/socketio.services.mock.js"),
	SocketioDataMock = new (require("./mocks/socketio.data.mock.js"))(),
	LOGS = require("../../lib/socketio/socketio.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;

beforeEach(() => {
	res = new ResMock();
});
controller = new SocketioController();
services = new SocketioServicesMock();
controller.init({services, config: {LOGS}});