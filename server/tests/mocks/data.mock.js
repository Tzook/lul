'use strict';
/**
 * General data mock
 */
class DataMock {
	get randomString() {
		return "random {person}";
	}
	
	get randomStringtokenReplaced() {
		return "random john"
	}
	
	get tokens() {
		return {person: "john"};
	}
	
	get hashedRandomString() {
		return "c5818f7dab6343916290b87f4f84a319";
	}
	
	get fields() {
		return ["1", "2"];
	}
	
	get object() {
		return {1: 1, 2: 1, 3: 2};
	}
	
	get objectWithFields() {
		return {1: 1, 2: 1};
	}
}

module.exports = DataMock;