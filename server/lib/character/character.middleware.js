'use strict';
let MiddlewareBase = require('../master/master.middleware.js');

/**
 * Character's middleware
 */
class CharacterMiddleware extends MiddlewareBase {
	
	/**
     * Init the instance
     */
    init(files, app) {
		super.init(files, app);
		this.SPRITES = files.config.SPRITES;
    }
    
	
	validateCreateCharacterParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "name", 	  isType: ["string"], callback: this.services.invalidatesRegex, args: [req.body.name, /[^a-z0-9]/i, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'name']}, 
			{param: "name", 	  isType: ["string"], callback: this.services.inRange, args: [req.body.name && req.body.name.length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'name']}, 
			{param: "g", 		  isType: ["boolean"]}
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
}

module.exports = CharacterMiddleware;