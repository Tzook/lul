
import Response from './master.response';
import { isProduction } from '../main/main';

export default class MasterMiddleware extends Response {

	protected validateParams(req, res, next, params) {
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

	isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.user) {
			next();
		} else {
			this.sendError(res, this.LOGS.MASTER_NOT_LOGGED_IN);
		}
    }
    
	debounceIfLocal(req, res, next) {
        if (isProduction()) {
            next();
		} else {
            // in local, give it a bit of time so it won't freeze
			setTimeout(() => next(), 500);
		}
	}

	public validateHasSercetKey(req, res, next) {
		let pass = process.env.secretKey ? process.env.secretKey : require('../../../config/.env.json').secretKey;
		if (pass && req.body.pass === pass) {
			next();
		} else {
			this.sendError(res, this.LOGS.MASTER_INVALID_PARAM_TYPE, { param: 'pass' })
		}
	}
};