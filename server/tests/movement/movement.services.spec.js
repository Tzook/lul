'use strict';
let expect = require("chai").expect,
	MovementServices = require("../../lib/movement/movement.services.js"),
	MovementModel = require("../../lib/movement/movement.model.js"),
	MovementDataMock = new (require("./mocks/movement.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new MovementModel();
model.init();
 
beforeEach(() => {
	services = new MovementServices();
	services.init({model});
});