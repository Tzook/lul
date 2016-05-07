'use strict';
let SocketioDataMock = new (require("./socketio.data.mock.js"))();
let ServicesBase = require("../../../lib/master/master.services.js");

/**
 * user services mock
 */
class SocketioServicesMock extends ServicesBase {
	get validSocketio() {
		return {
			
		};
	}
}

module.exports = SocketioServicesMock;