
import MasterController from '../master/master.controller';
import UserServices from './user.services';
import { Response } from 'express';
import userConfig from './user.config';
import { getBanExplanation } from '../ban/ban.services';

export default class UserController extends MasterController {
    protected services: UserServices;

    sendUser(req, res) {
        req.user.password = undefined; // remove the password
        this.sendData(res, req.LOG || this.LOGS.USER_SESSION_OK, req.user);
    }

    sendLogout(req, res, next) {
        this.sendData(res, this.LOGS.USER_LOGGED_OUT_OK);
    }

    sendDeleted(req, res, next) {
        this.sendData(res, this.LOGS.USER_DELETED);
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

    performLogout(req, res: Response, next) {
        req.session.destroy(e => {
            if (e) {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "performLogout", file: "user.controller.js"});
            } else {
                res.clearCookie(userConfig.UNICORN);
                next();
            }
        });
    }

    handleNewUser(req, res, next) {
        return this.services.saveNewUser(req.body)
            .then(d => {
                req.body.user = d;
                req.LOG = this.LOGS.USER_REGISTERED_OK;
                next();
            })
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "handleNewUser", file: "user.controller.js"});
            });
    }

    deleteUser(req, res, next) {
        return this.services.deleteUser(req.user._id)
            .then(d => next())
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "deleteUser", file: "user.controller.js"});
            });
    }

    // PASSPORT FUNCTIONS //
    // ================== //
    serializeUser(user, done) {
        done(null, user.username);
    }
    
    deserializeUser (username, done) {
        return this.services.getUser(username)
            .then ((user: User): any => {
                if (!user) {
                    return Promise.reject("No user found");
                } else if (user.banEnd && user.banEnd > new Date()) {
                    return Promise.reject(getBanExplanation(user));
                } else {
                    done(null, user);
                }
            })
            .catch(e => {
                done(e, null); // error
            });
    }

	deserializeError(e, res) {
        if (e.includes("ban")) {
            this.sendError(res, userConfig.LOGS.USER_BANNED, {message: e});
        } else {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "deserializeUser", file: "user.controller.js"});
        }
	}
};