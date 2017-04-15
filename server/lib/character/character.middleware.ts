'use strict';
import MasterMiddleware from '../master/master.middleware';
import CharacterServices from './character.services';
let config = require('../../../server/lib/character/character.config.json');

export default class CharacterMiddleware extends MasterMiddleware {
	protected services: CharacterServices;

	public validHasFewCharacters(req, res, next) {
		if (req.user.characters.length < config.MAX_CHARACTERS) {
			next();
		} else {
			this.sendError(res, this.LOGS.MAX_CHARACTERS)
		}
	}

	validateCreateCharacterParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "name", isType: ["string"], callback: this.services.invalidatesRegex, args: [req.body.name, /[^a-z0-9]/i, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'name']},
			{param: "name", isType: ["string"], callback: this.services.inRange, args: [req.body.name && req.body.name.length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'name']},
			{param: "g", 	isType: ["string"]},
			{param: "eyes", isType: ["string"]},
			{param: "nose", isType: ["string"]},
			{param: "mouth",isType: ["string"]},
			{param: "skin", isType: ["string"]},
			{param: "hair", isType: ["string"]}
		]);
	}

	convertToFormatAndCheckNameUniqueness(req, res, next) {
		return Promise.all([
			this.services.checkIsNameUnique(req.body.name, {LOG: this.LOGS.CHARACTER_NAME_CAUGHT, params: {name: req.body.name}}),
			this.services.convertToFormat(req.body)
		])
		.then(d => {
			req.body = d[1];
			next();
		})
		.catch(e => {
			if (typeof e !== 'object' || !e.LOG) {
				e = {LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: {e, fn: "convertToFormatAndCheckNameUniqueness", file: "character.middleware.js"}};
			}
			this.sendError(res, e.LOG, e.params);
		});
	}

	validateDeleteCharacterParams(req, res, next) {
		if (req.body.id) {
			next();
		} else {
			this.sendError(res, this.LOGS.MASTER_INVALID_PARAM_TYPE, {param: 'id'})
		}
	}

	validateCharacterBelongsToUser(req, res, next) {
		var found = false;
		for (var i = 0; i < req.user.characters.length; i++) {
			if (req.user.characters[i]._id.equals(req.body.id)) {
				found = true;
				break;
			}
		}
		if (found) {
			next();
		} else {
			this.sendError(res, this.LOGS.CHARACTER_DOES_NOT_EXIST);
		}
	}
};