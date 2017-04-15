'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
class CharacterMiddleware extends master_middleware_1.default {
    validateCreateCharacterParams(req, res, next) {
        return this.validateParams(req, res, next, [
            { param: "name", isType: ["string"], callback: this.services.invalidatesRegex, args: [req.body.name, /[^a-z0-9]/i, this.LOGS.MASTER_INVALID_PARAM_TYPE, 'name'] },
            { param: "name", isType: ["string"], callback: this.services.inRange, args: [req.body.name && req.body.name.length, 1, 16, this.LOGS.MASTER_OUT_OF_RANGE, 'name'] },
            { param: "g", isType: ["string"] },
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
exports.default = CharacterMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXJhY3Rlci9jaGFyYWN0ZXIubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRzNELHlCQUF5QyxTQUFRLDJCQUFnQjtJQUdoRSw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7WUFDMUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxFQUFDO1lBQy9KLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsRUFBQztZQUNqSyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUM7WUFDakMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDO1lBQ25DLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBQztZQUNuQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUM7WUFDbkMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDO1lBQ25DLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBQztTQUNuQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQscUNBQXFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBQyxDQUFDO1lBQ3JILElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7U0FDdkMsQ0FBQzthQUNELElBQUksQ0FBQyxDQUFDO1lBQ04sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxFQUFFLENBQUM7UUFDUixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQztZQUNQLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLHVDQUF1QyxFQUFFLElBQUksRUFBRSx5QkFBeUIsRUFBQyxFQUFDLENBQUM7WUFDdkksQ0FBQztZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELDZCQUE2QixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxFQUFFLENBQUM7UUFDUixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7UUFDeEUsQ0FBQztJQUNGLENBQUM7SUFFRCw4QkFBOEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDNUMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDYixLQUFLLENBQUM7WUFDUCxDQUFDO1FBQ0YsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLEVBQUUsQ0FBQztRQUNSLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN6RCxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBdkRELHNDQXVEQztBQUFBLENBQUMifQ==