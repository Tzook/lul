
import MasterMiddleware from '../master/master.middleware';
import { isBanned, getBanExplanation } from '../ban/ban.services';
import userConfig from './user.config';
let passport = require('passport');

export default class UserMiddleware extends MasterMiddleware {

	hasLoginParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "username", isType: ["string"]},
			{param: "password", isType: ["string"]}
		]);
	}

	hasRegisterParams(req, res, next) {
		return this.validateParams(req, res, next, [
			{param: "username", isType: ["string"], callback: this.services.inRange, args: [("" + (req.body.username || "")).length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'username']},
			{param: "password", isType: ["string"], callback: this.services.inRange, args: [(req.body.password || "").length, 32, 32, this.LOGS.MASTER_OUT_OF_RANGE, 'password']}
		]);
	}

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

    passportLocalAuthenticate(req, res, next) {
		passport.authenticate('local', (e, d, info) => {
			if (e) {
				if (typeof e !== 'object' || !e.LOG) {
					e = {LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: {e, fn: "passportLocalAuthenticate", file: "user.middleware.js"}};
				}
				this.sendError(res, e.LOG, e.params);
			} else if (isBanned(d)) {
				this.sendError(res, userConfig.LOGS.USER_BANNED, {message: getBanExplanation(d)});
			} else {
				req.body.user = d;
				next();
			}
		})(req, res, next);
    }
};