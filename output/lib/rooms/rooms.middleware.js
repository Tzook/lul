'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
let ROOMS_MAP = require('../../../server/lib/rooms/rooms.config.json').ROOMS_MAP;
class RoomsMiddleware extends master_middleware_1.default {
    canEnterRoom(wantedRoom, currentRoom) {
        return ROOMS_MAP[currentRoom].indexOf(wantedRoom) !== -1;
    }
}
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUVqRixxQkFBcUMsU0FBUSwyQkFBZ0I7SUFFbEQsWUFBWSxDQUFDLFVBQWtCLEVBQUUsV0FBbUI7UUFDdkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBTEQsa0NBS0M7QUFBQSxDQUFDIn0=