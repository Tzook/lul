'use strict';
let ControllerBase = require('../master/master.controller.js');
/**
 * User's Controller
 */
class UserController extends ControllerBase {
    /**
     * Removes the password, and sends the user
     */
    sendUser(req, res) {
        req.user.password = undefined; // remove the password
        this.sendData(res, req.LOG || this.LOGS.USER_SESSION_OK, req.user);
    }
    /**
     * Perform login - will attach the user to the req
     */
    performLogin(req, res, next) {
        // req.login is attached by passport
        req.login(req.body.user, e => {
            if (!e) {
                req.LOG = req.LOG || this.LOGS.USER_LOGGED_IN_OK;
                next();
            }
            else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e: e, fn: "performLogin", file: "user.controller.js" });
            }
        });
    }
    /**
     * Perform logout - will remove the session, and response upon finishing
     */
    performLogout(req, res) {
        req.session.destroy(e => {
            if (!e) {
                this.sendData(res, this.LOGS.USER_LOGGED_OUT_OK);
            }
            else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e: e, fn: "performLogout", file: "user.controller.js" });
            }
        });
    }
    /**
     * Tries to register a user to database
     */
    handleNewUser(req, res, next) {
        return this.services.saveNewUser(req.body)
            .then(d => {
            req.body.user = d[0];
            req.LOG = this.LOGS.USER_REGISTERED_OK;
            next();
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e: e, fn: "handleNewUser", file: "user.controller.js" });
        });
    }
    // PASSPORT FUNCTIONS //
    // ================== //
    /**
     * Passport's serialize function - by username
     */
    serializeUser(user, done) {
        done(null, user.username);
    }
    /**
     * Passport's deserialize function - find by password and return it
     */
    deserializeUser(username, done) {
        return this.services.getUser(username)
            .then(d => {
            if (d) {
                done(null, d);
            }
            else {
                done(null, false); // found no user
            }
        })
            .catch(e => {
            done(e, null); // error
        });
    }
    /**
     * Had an internal error deserializing the user
     */
    deserializeError(e, res) {
        this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e: e, fn: "deserializeUser", file: "user.controller.js" });
    }
}
module.exports = UserController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi91c2VyL3VzZXIuY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUUvRDs7R0FFRztBQUNILDZCQUE2QixjQUFjO0lBQ3ZDOztPQUVHO0lBQ0gsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHO1FBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsc0JBQXNCO1FBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7T0FFRztJQUNILFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDdkIsb0NBQW9DO1FBQ3BDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2pELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQyxHQUFBLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBQyxDQUFDLENBQUM7WUFDOUcsQ0FB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