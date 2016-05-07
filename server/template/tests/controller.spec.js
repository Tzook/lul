'use strict';
let expect = require("chai").expect,
	TemplateController = require("../../lib/template/template.controller.js"),
	TemplateServicesMock = require("./mocks/template.services.mock.js"),
	TemplateDataMock = new (require("./mocks/template.data.mock.js"))(),
	LOGS = require("../../lib/template/template.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new TemplateController();
services = new TemplateServicesMock();
controller.init({services, config: {LOGS}});