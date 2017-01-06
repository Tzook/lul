'use strict';
const master_middleware_1 = require("../master/master.middleware");
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        return ROOMS_MAP[currentRoom].indexOf(wantedRoom) !== -1;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixtRUFBMkQ7QUFDM0QsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBRWpGLHFCQUFxQyxTQUFRLDJCQUFnQjtJQUVsRCxZQUFZLENBQUMsVUFBa0IsRUFBRSxXQUFtQjtRQUN2RCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0o7O0FBTEQsa0NBS0M7QUFBQSxDQUFDIn0=