'use strict';
let expect = require("chai").expect,
	ServicesBase = require("../../lib/master/master.services.js"),
	DataMock = new (require("../mocks/data.mock.js"))(),
	services;
 
services = new ServicesBase();

describe("promiseByCondition", () => {
	it('should return a promise resolved if condition is true', () => {
		return services.promiseByCondition(true, 1, 2)
		.then(d => {
			expect(d).to.equal(1);
		});
	});
	
	it('should return a promise rejected if condition is false', () => {
		return services.promiseByCondition(false, 1, 2)
		.then(d => {
			throw new Error('Promise was fulfilled with: ' + d);
		}, e => {
			expect(e).to.equal(2);
		});
	});
});

describe("copyFields", () => {
	it('should copy all fields from one object to the other', () => {
		let object = {};
		return services.copyFields(DataMock.object, object, DataMock.fields)
		.then(d => {
			expect(d).to.deep.equal(DataMock.objectWithFields);
		});
	});
});

describe("isNotEmpty", () => {
	it('should return a promise resolved if object is not empty', () => {
		return services.isNotEmpty(1, 2)
		.then(d => {
			expect(d).to.equal(1);
		});
	});
	
	it('should return a promise rejected if object is empty', () => {
		return services.isNotEmpty(undefined, 2)
		.then(d => {
			throw new Error('Promise was fulfilled with: ' + d);
		}, e => {
			expect(e).to.equal(2);
		});
	});
});

describe("isEmpty", () => {
	it('should return a promise resolved if object is empty', () => {
		return services.isEmpty(false, 2)
		.then(d => {
			expect(d).to.equal(false);
		});
	});
	
	it('should return a promise rejected if object is not empty', () => {
		return services.isEmpty(true, 2)
		.then(d => {
			throw new Error('Promise was fulfilled with: ' + d);
		}, e => {
			expect(e).to.equal(2);
		});
	});
});

describe("checkEquals", () => {
	it('should return a promise resolved if both variables are equal', () => {
		return services.checkEquals("lah", "lah", 1, 2)
		.then(d => {
			expect(d).to.equal(1);
		});
	});
	
	it('should return a promise rejected if both variables are not equal', () => {
		return services.checkEquals(30, 31, 1, 2)
		.then(d => {
			throw new Error('Promise was fulfilled with: ' + d);
		}, e => {
			expect(e).to.equal(2);
		});
	});
});

describe("replaceTokens", () => {
	it('should replace tokens properly', () => {
		return services.replaceTokens(DataMock.randomString, DataMock.tokens)
		.then(d => {
			expect(d).to.equal(DataMock.randomStringtokenReplaced);
		});
	});
});