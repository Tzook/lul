'use strict';
let ChatDataMock = new (require("./chat.data.mock.js"))();
/**
 * user services mock
 */
class ChatServicesMock {
	get validChat() {
		return {
			
		};
	}
}

module.exports = ChatServicesMock;