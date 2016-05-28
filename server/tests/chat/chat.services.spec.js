'use strict';
let expect = require("chai").expect,
	ChatServices = require("../../lib/chat/chat.services.js"),
	ChatModel = require("../../lib/chat/chat.model.js"),
	ChatDataMock = new (require("./mocks/chat.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new ChatModel();
model.init();
 
beforeEach(() => {
	services = new ChatServices();
	services.init({model});
});