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
    }
    validateCreateCharacterParams(req, res, next) {
        return this.validateParams(req, res, next, [
            { param: "name", isType: ["string"], callback: this.services.invalidatesRegex, args: [req.body.name, /[^a-z0-9]/i, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'name'] },
            { param: "name", isType: ["string"], callback: this.services.inRange, args: [req.body.name && req.body.name.length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'name'] },
            { param: "g", isType: ["string"], callback: this.services.isBool, args: [req.body.g, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'g'] }
        ]);
    }
    convertToFormatAndCheckNameUniqueness(req, res, next) {
        return Promise.all([
            this.services.checkIsNameUnique(req.body.name, { LOG: this.LOGS.CHARACTER_NAME_CAUGHT, params: { name: req.body.name } }),
            this.services.convertToFormat(req.body)
        ])
            .then(d => {
            req.body = d[1];
            next();
        })
            .catch(e => {
            if (typeof e !== 'object' || !e.LOG) {
                e = { LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: { e: e, fn: "convertToFormatAndCheckNameUniqueness", file: "character.middleware.js" } };
            }
            this.sendError(res, e.LOG, e.params);
        });
    }
    validateDeleteCharacterParams(req, res, next) {
        if (req.body.id) {
            next();
        }
        else {
            this.sendError(res, this.LOGS.MASTER_INVALID_PARAM_TYPE, { param: 'id' });
        }
    }
    validateCharacterBelongsToUser(req, res, next) {
        var found = false;
        for (var i = 0; i < req.user.characters.length; i++) {
            if (req.user.characters[i]._id.equals(req.body.id)) {
                found = true;
                break;
            }
        }
        if (found) {
            next();
        }
        else {
            this.sendError(res, this.LOGS.CHARACTER_DOES_NOT_EXIST);
        }
    }
}
module.exports = CharacterMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXJhY3Rlci9jaGFyYWN0ZXIubWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUUvRDs7R0FFRztBQUNILGtDQUFrQyxjQUFjO0lBRS9DOztPQUVNO0lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFHSiw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7WUFDMUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxFQUFDO1lBQy9KLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxN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