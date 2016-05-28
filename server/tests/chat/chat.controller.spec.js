'use strict';
let expect = require("chai").expect,
	ChatController = require("../../lib/chat/chat.controller.js"),
	ChatServicesMock = require("./mocks/chat.services.mock.js"),
	ChatDataMock = new (require("./mocks/chat.data.mock.js"))(),
	LOGS = require("../../lib/chat/chat.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new ChatController();
services = new ChatServicesMock();
controller.init({services, config: {LOGS}});