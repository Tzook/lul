'use strict';
let expect = require("chai").expect,
	CharacterMiddleware = require("../../lib/character/character.middleware.js"),
	CharacterServicesMock = require("./mocks/character.services.mock.js"),
	CharacterDataMock = new (require("./mocks/character.data.mock.js"))(),
	LOGS = require("../../lib/character/character.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new CharacterMiddleware();
services = new CharacterServicesMock();
middleware.init({services, config: {LOGS}});