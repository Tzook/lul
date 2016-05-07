'use strict';
let MasterDataMock = new (require("./master.data.mock.js"))();
let ServicesBase = require("../../../lib/master/master.services.js");

/**
 * user services mock
 */
class MasterServicesMock extends ServicesBase {
	get validMaster() {
		return {
			
		};
	}
}

module.exports = MasterServicesMock;