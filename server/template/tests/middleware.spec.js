'use strict';
let expect = require("chai").expect,
	TemplateMiddleware = require("../../lib/template/template.middleware.js"),
	TemplateServicesMock = require("./mocks/template.services.mock.js"),
	TemplateDataMock = new (require("./mocks/template.data.mock.js"))(),
	LOGS = require("../../lib/template/template.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
middleware = new TemplateMiddleware();
services = new TemplateServicesMock();
middleware.init({services, config: {LOGS}});