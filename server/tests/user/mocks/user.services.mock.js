'use strict';
let UserDataMock = new (require("./user.data.mock.js"))();
let ServicesBase = require("../../../lib/master/master.services.js");
/**
 * user services mock
 */
class UserServicesMock extends ServicesBase {
	getUser(username) {
		let validUser = UserDataMock.validUser,
			promise;
		if (username !== validUser.username) { // not found indeed
			promise = Promise.resolve();
		} else {
			promise = Promise.resolve(validUser);
		}
		return promise;
	}
	
    saveNewUser(user) {
        return Promise.resolve([Object.assign({}, user)]);
    }
}

module.exports = UserServicesMock;