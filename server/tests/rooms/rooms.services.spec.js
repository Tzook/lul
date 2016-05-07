'use strict';
let expect = require("chai").expect,
	RoomsServices = require("../../lib/rooms/rooms.services.js"),
	RoomsModel = require("../../lib/rooms/rooms.model.js"),
	RoomsDataMock = new (require("./mocks/rooms.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new RoomsModel();
model.init();
 
beforeEach(() => {
	services = new RoomsServices();
	services.init({model});
});