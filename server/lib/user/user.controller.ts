'use strict';
import MasterController from '../master/master.controller';

export default class UserController extends MasterController {

    sendUser(req, res) {
        req.user.password = undefined; // remove the password
        this.sendData(res, req.LOG || this.LOGS.USER_SESSION_OK, req.user);
    }

    performLogin(req, res, next) {
        // req.login is attached by passport
        req.login(req.body.user, e => {
            if (!e) {
                req.LOG = req.LOG || this.LOGS.USER_LOGGED_IN_OK;
                next();
            } else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "performLogin", file: "user.controller.js"});
            }
        });
    }

    performLogout(req, res) {
        req.session.destroy(e => {
            if (!e) {
                this.sendData(res, this.LOGS.USER_LOGGED_OUT_OK);
            } else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "performLogout", file: "user.controller.js"});
            }
        });
    }

    handleNewUser(req, res, next) {
        return this.services.saveNewUser(req.body)
        .then(d => {
            req.body.user = d[0];
            req.LOG = this.LOGS.USER_REGISTERED_OK;
            next();
        })
        .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "handleNewUser", file: "user.controller.js"});
        });
    }


    // PASSPORT FUNCTIONS //
    // ================== //
    serializeUser(user, done) {
        done(null, user.username);
    }

    deserializeUser (username, done) {
        return this.services.getUser(username)
        .then (d => {
            if (d) {
                done(null, d);
            } else {
                done(null, false); // found no user
            }
        })
        .catch(e => {
            done(e, null); // error
        });
    }

	deserializeError(e, res) {
        this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "deserializeUser", file: "user.controller.js"});
	}
};