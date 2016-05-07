'use strict';
let expect = require("chai").expect,
	UserServices = require("../../lib/user/user.services.js"),
	UserModel = require("../../lib/user/user.model.js"),
	UserDataMock = new (require("./mocks/user.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new UserModel();
model.init();
 
services = new UserServices();
services.init({model});
