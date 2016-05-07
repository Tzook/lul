'use strict';
let expect = require("chai").expect,
	TemplateServices = require("../../lib/template/template.services.js"),
	TemplateModel = require("../../lib/template/template.model.js"),
	TemplateDataMock = new (require("./mocks/template.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new TemplateModel();
model.init();
 
beforeEach(() => {
	services = new TemplateServices();
	services.init({model});
});