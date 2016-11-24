'use strict';
const master_middleware_1 = require('../master/master.middleware');
let ROOM_NAMES = require('../../../server/lib/rooms/rooms.config.json').ROOM_NAMES;
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        if (wantedRoom == ROOM_NAMES.DEFAULT_ROOM && currentRoom == ROOM_NAMES.NEXT_ROOM
            || wantedRoom == ROOM_NAMES.NEXT_ROOM && currentRoom == ROOM_NAMES.DEFAULT_ROOM) {
            return true;
        }
        return false;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixvQ0FBNkIsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFFbkYsOEJBQTZDLDJCQUFnQjtJQUVsRCxZQUFZLENBQUMsVUFBa0IsRUFBRSxXQUFtQjtRQUN2RCxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLFlBQVksSUFBSSxXQUFXLElBQUksVUFBVSxDQUFDLFNBQVM7ZUFDekUsVUFBVSxJQUFJLFVBQVUsQ0FBQyxTQUFTLElBQUksV0FBVyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztBQUNMLENBQUM7QUFURDtpQ0FTQyxDQUFBO0FBQUEsQ0FBQyJ9