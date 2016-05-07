'use strict';
let expect = require("chai").expect,
	CharacterController = require("../../lib/character/character.controller.js"),
	CharacterServicesMock = require("./mocks/character.services.mock.js"),
	CharacterDataMock = new (require("./mocks/character.data.mock.js"))(),
	LOGS = require("../../lib/character/character.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new CharacterController();
services = new CharacterServicesMock();
controller.init({services, config: {LOGS}});