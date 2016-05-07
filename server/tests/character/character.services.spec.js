'use strict';
let expect = require("chai").expect,
	CharacterServices = require("../../lib/character/character.services.js"),
	CharacterModel = require("../../lib/character/character.model.js"),
	CharacterDataMock = new (require("./mocks/character.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new CharacterModel();
model.init();
 
beforeEach(() => {
	services = new CharacterServices();
	services.init({model});
});