'use strict';
let expect = require("chai").expect,
	ChatMiddleware = require("../../lib/chat/chat.middleware.js"),
	ChatServicesMock = require("./mocks/chat.services.mock.js"),
	ChatDataMock = new (require("./mocks/chat.data.mock.js"))(),
	LOGS = require("../../lib/chat/chat.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new ChatMiddleware();
services = new ChatServicesMock();
middleware.init({services, config: {LOGS}});