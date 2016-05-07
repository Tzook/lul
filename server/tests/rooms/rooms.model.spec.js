'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/rooms/rooms.model.js"))(),
	RoomsDataMock = new (require("./mocks/rooms.data.mock.js"))();
 
Model.init();
Model.createModel();
Model = Model.getModel();
	
describe("Rooms schema", () => {
 	it('should have a valid rooms object', () => {
		let validRooms = RoomsDataMock.validRooms; 
		let schemadRooms = new Model(validRooms);
		for (let i in validRooms) {
			expect(validRooms[i]).to.deep.equal(schemadRooms[i]);
		}
	});
});