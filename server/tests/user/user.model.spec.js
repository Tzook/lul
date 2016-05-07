'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/user/user.model.js"))(),
	UserDataMock = new (require("./mocks/user.data.mock.js"))();
 
Model.init();
Model.createModel();
Model = Model.getModel();
	
describe("User schema", () => {
 	it('should have a valid username and password object', () => {
		let validUser = UserDataMock.validUser; 
		let schemadUser = new Model(validUser);
		for (let i in validUser) {
			expect(validUser[i]).to.deep.equal(schemadUser[i]);
		}
	});
});