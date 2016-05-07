'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/character/character.model.js"))(),
	CharacterDataMock = new (require("./mocks/character.data.mock.js"))();
 
Model.init();
Model.createModel();
Model = Model.getModel();
	
describe("Character schema", () => {
 	it('should have a valid character object', () => {
		let validCharacter = CharacterDataMock.validCharacter; 
		let schemadCharacter = new Model(validCharacter);
		for (let i in validCharacter) {
			expect(validCharacter[i]).to.deep.equal(schemadCharacter[i]);
		}
	});
});