'use strict';
let MiddlewareBase = require('../master/master.middleware.js');
let passport = require('passport');

/**
 * User's middleware
 * @exports UserMiddleware
 */
class UserMiddleware extends MiddlewareBase {
	/**
	 * Makes sure valid login params are there
	 */
	hasLoginParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "username", isType: ["string"]}, 
			{param: "password", isType: ["string"]}
		]);
	}
	
	/**
	 * Makes sure valid register params are there
	 */
	hasRegisterParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "username", isType: ["string"], callback: this.services.inRange, args: [("" + req.body.username).length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'username']}, 
			{param: "password", isType: ["string"], callback: this.services.inRange, args: [req.body.password.length, 32, 32, this.LOGS.MASTER_OUT_OF_RANGE, 'password']}
		]);
	}
	
	/**
	 * Make sure no user is logged in
	 */
	isLoggedOut(req, res, next) {
		if (!req.user) {
			next();
		} else {
			this.sendError(res, this.LOGS.USER_NOT_LOGGED_OUT);
		}
	}
	
	/**
	 * Makes sure a user with that username is not already registered
	 */
	isUsernameUnique(req, res, next) {
		return this.services.getUser(req.body.username)
		.then(d => this.services.isEmpty(d, {LOG: this.LOGS.USER_USERNAME_CAUGHT, params: {username: req.body.username}}))
		.then(d => {
			next();
		})
		.catch(e => {
			if (typeof e !== 'object' || !e.LOG) {
				e = {LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: {e, fn: "isUsernameUnique", file: "user.middleware.js"}};
			} 
			this.sendError(res, e.LOG, e.params);
		});
	}
	
	// PASSPORT FUNCTIONS //
	// ================== //
    /**
     * Checks if username exists. also compares the passwords. If both are true, continues with the user, othewise with an error
     */
    authenticateUser(username, password, done) {
        return this.services.getUser(username)
        .then(d => this.services.isNotEmpty(d, {LOG: this.LOGS.USER_NO_SUCH_USERNAME, params: {username}}))
        .then(d => this.services.checkEquals(password, d.password, d, {LOG: this.LOGS.USER_WRONG_PASSWORD}))
        .then(d => {
            done(null, d);
        })
        .catch(e => {
            done(e, null);
        });
    }
	 /**
	  * users the local authentication function, and sets the user object on the body 
	  */
    passportLocalAuthenticate(req, res, next) {
		passport.authenticate('local', (e, d, info) => {
			if (!e) { 
				req.body.user = d;
				next();
			} else {
				if (typeof e !== 'object' || !e.LOG) {
					e = {LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: {e, fn: "passportLocalAuthenticate", file: "user.middleware.js"}};
				} 
				this.sendError(res, e.LOG, e.params);
			}
		})(req, res, next);
    }
}

module.exports = UserMiddleware;