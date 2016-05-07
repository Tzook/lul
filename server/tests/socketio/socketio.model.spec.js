'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/socketio/socketio.model.js"))(),
	SocketioDataMock = new (require("./mocks/socketio.data.mock.js"))();
 
Model.init();
