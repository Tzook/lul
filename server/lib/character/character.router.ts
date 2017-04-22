'use strict';
import MasterRouter from '../master/master.router';
import CharacterMiddleware from './character.middleware';
import CharacterController from './character.controller';

export default class CharacterRouter extends MasterRouter {
	protected middleware: CharacterMiddleware;
	protected controller: CharacterController;

	protected initRoutes(app) {
		app.post(this.ROUTES.CHARACTER_CREATE,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.middleware.validHasFewCharacters.bind(this.middleware),
			this.middleware.validateCreateCharacterParams.bind(this.middleware),
			this.middleware.convertToFormatAndCheckNameUniqueness.bind(this.middleware),
			this.controller.handleNewCharacter.bind(this.controller));

		app.post(this.ROUTES.CHARACTER_DELETE,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.middleware.validateDeleteCharacterParams.bind(this.middleware),
			this.middleware.validateCharacterBelongsToUser.bind(this.middleware),
			this.controller.deleteCharacter.bind(this.controller));
	}
};