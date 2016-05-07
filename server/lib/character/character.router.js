'use strict';
let RouterBase = require('../master/master.router.js');

/**
 * Character's router
 */
class CharacterRouter extends RouterBase {
	/**
	 * Initializes the instance
	 */
	init(files, app) {
		super.init(files, app);   
	}
	
	initRoutes(app) {					
		app.post(this.ROUTES.CHARACTER_CREATE, 
			this.middleware.isLoggedIn.bind(this.middleware),
			this.middleware.validateCreateCharacterParams.bind(this.middleware),
			this.middleware.convertToFormatAndCheckNameUniqueness.bind(this.middleware),
			this.controller.handleNewCharacter.bind(this.controller));
	}
}

module.exports = CharacterRouter;