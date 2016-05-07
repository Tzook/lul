'use strict';
/**
 * user services mock
 */
class UserDataMock {
	get emptyData() {
		return {};
	}
	
	get usernameOnly() {
		return {username: "valid"};
	}
	
	get badUsername() {
		return {username: this.validUser.username + "123"};
	}
	
	get passwordOnly() {
		return {password: "hlab"};
	}
	
	get badPassword() {
		return {username: this.validUser.username, password: this.validUser.password + "123"};
	}
	
	get validUser() {
		return {username: "valid", password: "user"};
	}
	
	get passwordlessUser() {
        return {username: "valid", password: undefined};
	}
	
	get hashedPassword() {
		return "ee11cbb19052e40b07aac0ca060c23ee"; // password's hash from validUser ("user")
	}
}

module.exports = UserDataMock;