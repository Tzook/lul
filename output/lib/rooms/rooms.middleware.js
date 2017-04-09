'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        return !!this.services.getRoomInfo(currentRoom).portals[wantedRoom];
    }
    validateHasSercetKey(req, res, next) {
        let pass = process.env.generateRoomsPass ? process.env.generateRoomsPass : require('../../../config/.env.json').generateRoomsPass;
        if (pass && req.body.scene && req.body.scene.pass === pass) {
            next();
        }
        else {
            this.sendError(res, this.LOGS.MASTER_INVALID_PARAM_TYPE, { param: 'scene.pass' });
        }
    }
}
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUVqRixxQkFBcUMsU0FBUSwyQkFBZ0I7SUFHbEQsWUFBWSxDQUFDLFVBQWtCLEVBQUUsV0FBbUI7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVNLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUM1QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUMsaUJBQWlCLENBQUE7UUFDakksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFBO1FBQ2hGLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFmRCxrQ0FlQztBQUFBLENBQUMifQ==