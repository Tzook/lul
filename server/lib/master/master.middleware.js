'use strict';
let Response = require('./master.response.js');

/**
 *  Middleware base class to manage middlewares
 */
class MiddlewareBase extends Response {
	/**
	 * Makes sure valid params are there and copy them to validBody
	 * @param req IncomingMessage
	 * @param res ServerResponse
	 * @param next Function
	 * @param params Object
	 */
	validateParams(req, res, next, params) {
		let promises = [];
		for (let i in params) {
			promises.push(this.services.isNotEmpty(req.body[params[i].param], {error: this.LOGS.MASTER_INVALID_PARAM, params: {param: params[i].param}}));
			promises.push(this.services.inArray(typeof req.body[params[i].param], params[i].isType, this.LOGS.MASTER_INVALID_PARAM, params[i].param));
			params[i].callback && promises.push(params[i].callback.apply(this.services, params[i].args));
		}
		return Promise.all(promises)
		.then(d => {
			next();
		})
		.catch(err => {
			this.sendError(res, err.error, err.params);
		});
	}
	
	/**
	* Make sure a user is logged in
	*/
	isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.user) {
			next();
		} else {
			this.sendError(res, this.LOGS.MASTER_NOT_LOGGED_IN);
		}
	}
};

module.exports = MiddlewareBase;


// register error! isNotRegistered