'use strict';
let CharacterDataMock = new (require("./character.data.mock.js"))();
/**
 * user services mock
 */
class CharacterServicesMock {
	get validCharacter() {
		return {
			
		};
	}
}

module.exports = CharacterServicesMock;