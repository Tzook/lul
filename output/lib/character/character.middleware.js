'use strict';
const master_middleware_1 = require("../master/master.middleware");
class CharacterMiddleware extends master_middleware_1.default {
    validateCreateCharacterParams(req, res, next) {
        return this.validateParams(req, res, next, [
            { param: "name", isType: ["string"], callback: this.services.invalidatesRegex, args: [req.body.name, /[^a-z0-9]/i, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'name'] },
            { param: "name", isType: ["string"], callback: this.services.inRange, args: [req.body.name && req.body.name.length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'name'] },
            { param: "g", isType: ["string"], callback: this.services.isBool, args: [req.body.g, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'g'] },
            { param: "eyes", isType: ["string"] },
            { param: "nose", isType: ["string"] },
            { param: "mouth", isType: ["string"] },
            { param: "skin", isType: ["string"] },
            { param: "hair", isType: ["string"] }
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
                e = { LOG: this.LOGS.MASTER_INTERNAL_ERROR, params: { e, fn: "convertToFormatAndCheckNameUniqueness", file: "character.middleware.js" } };
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CharacterMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXJhY3Rlci9jaGFyYWN0ZXIubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixtRUFBMkQ7QUFHM0QseUJBQXlDLFNBQVEsMkJBQWdCO0lBR2hFLDZCQUE2QixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtZQUMxQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsTUFBTSxDQUFDLEVBQUM7WUFDL0osRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxFQUFDO1lBQ2pLLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElB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