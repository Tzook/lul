'use strict';
let RoomsDataMock = new (require("./rooms.data.mock.js"))();
/**
 * user services mock
 */
class RoomsServicesMock {
	get validRooms() {
		return {
			
		};
	}
}

module.exports = RoomsServicesMock;