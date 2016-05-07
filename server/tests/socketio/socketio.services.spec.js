'use strict';
let expect = require("chai").expect,
	SocketioServices = require("../../lib/socketio/socketio.services.js"),
	SocketioModel = require("../../lib/socketio/socketio.model.js"),
	SocketioDataMock = new (require("./mocks/socketio.data.mock.js"))(),
	ResMock = require("../mocks/res.mock.js"),
	res,
	services,
	model;

model = new SocketioModel();
model.init();
 
services = new SocketioServices();
services.init({model});