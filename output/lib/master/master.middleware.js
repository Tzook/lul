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
            promises.push(this.services.isNotEmpty(req.body[params[i].param], { error: this.LOGS.MASTER_INVALID_PARAM, params: { param: params[i].param } }));
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
        }
        else {
            this.sendError(res, this.LOGS.MASTER_NOT_LOGGED_IN);
        }
    }
}
;
module.exports = MiddlewareBase;
// register error! isNotRegistered 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21hc3Rlci9tYXN0ZXIubWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUUvQzs7R0FFRztBQUNILDZCQUE2QixRQUFRO0lBQ3BDOzs7Ozs7T0FNRztJQUNILGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNO1FBQ3BDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzthQUMzQixJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksRUFBRSxDQUFDO1FBQ1IsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7TUFFRTtJQUNGLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDeEIsb0RBQW9EO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxFQUFFLENBQUM7UUFDUixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBQUEsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO0FBR2hDLGtDQUFrQyJ9