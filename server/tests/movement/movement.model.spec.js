'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/movement/movement.model.js"))(),
	MovementDataMock = new (require("./mocks/movement.data.mock.js"))();
 