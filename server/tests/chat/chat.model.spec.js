'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/chat/chat.model.js"))(),
	ChatDataMock = new (require("./mocks/chat.data.mock.js"))();
 
Model.init();
Model.createModel();
Model = Model.getModel();

describe("Chat schema", () => {
 	it('should have a valid chat object', () => {
		let validChat = ChatDataMock.validChat; 
		let schemadChat = new Model(validChat);
		for (let i in validChat) {
			expect(validChat[i]).to.deep.equal(schemadChat[i]);
		}
	});
});