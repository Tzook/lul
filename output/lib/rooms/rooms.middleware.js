'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
class RoomsMiddleware extends master_middleware_1.default {
    getPublicCharInfo(char) {
        let { name, position, equips, stats, looks, _id } = char;
        return { name, position, equips, stats, looks, _id };
    }
}
exports.default = RoomsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUNsRCxpQkFBaUIsQ0FBQyxJQUFVO1FBQy9CLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUN2RCxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDSjtBQUxELGtDQUtDO0FBQUEsQ0FBQyJ9