'use strict';
const master_middleware_1 = require('../master/master.middleware');
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        return ROOMS_MAP[currentRoom].indexOf(wantedRoom) !== -1;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixvQ0FBNkIsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFFakYsOEJBQTZDLDJCQUFnQjtJQUVsRCxZQUFZLENBQUMsVUFBa0IsRUFBRSxXQUFtQjtRQUN2RCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0wsQ0FBQztBQUxEO2lDQUtDLENBQUE7QUFBQSxDQUFDIn0=