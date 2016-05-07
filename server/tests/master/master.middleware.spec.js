'use strict';
let expect = require("chai").expect,
	MasterMiddleware = require("../../lib/master/master.middleware.js"),
	MasterServicesMock = require("./mocks/master.services.mock.js"),
	MasterDataMock = new (require("./mocks/master.data.mock.js"))(),
	LOGS = require("../../lib/master/master.config.json").LOGS,
	ResMock = require("../mocks/res.mock.js"),
	res,
	middleware,
	services;
 