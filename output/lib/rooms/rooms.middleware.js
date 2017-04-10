'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        let roomInfo = this.services.getRoomInfo(currentRoom);
        return !!(roomInfo && roomInfo.portals[wantedRoom]);
    }
}
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRzNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUdyRCxZQUFZLENBQUMsVUFBa0IsRUFBRSxXQUFtQjtRQUMxRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Q7QUFQRCxrQ0FPQztBQUFBLENBQUMifQ==