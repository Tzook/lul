'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class UserController extends master_controller_1.default {
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
            }
            else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "performLogin", file: "user.controller.js" });
            }
        });
    }
    performLogout(req, res) {
        req.session.destroy(e => {
            if (!e) {
                this.sendData(res, this.LOGS.USER_LOGGED_OUT_OK);
            }
            else {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "performLogout", file: "user.controller.js" });
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
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "handleNewUser", file: "user.controller.js" });
        });
    }
    // PASSPORT FUNCTIONS //
    // ================== //
    serializeUser(user, done) {
        done(null, user.username);
    }
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
    deserializeError(e, res) {
        this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "deserializeUser", file: "user.controller.js" });
    }
}
exports.default = UserController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi91c2VyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELG9CQUFvQyxTQUFRLDJCQUFnQjtJQUV4RCxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUc7UUFDYixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxzQkFBc0I7UUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDdkIsb0NBQW9DO1FBQ3BDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2pELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQyxDQUFDO1lBQzlHLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUc7UUFD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