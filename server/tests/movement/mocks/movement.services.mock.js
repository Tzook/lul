'use strict';
let MovementDataMock = new (require("./movement.data.mock.js"))();
/**
 * user services mock
 */
class MovementServicesMock {
	get validMovement() {
		return {
			
		};
	}
}

module.exports = MovementServicesMock;