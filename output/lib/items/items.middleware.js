'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
let config = require('../../../server/lib/items/items.config.json');
class ItemsMiddleware extends master_middleware_1.default {
    getFirstAvailableSlot(socket) {
        for (var slot = 0; slot < config.MAX_ITEMS; slot++) {
            if (!this.hasItem(socket, slot)) {
                break;
            }
        }
        return slot < config.MAX_ITEMS ? slot : -1;
    }
    isValidItemSlot(slot) {
        return slot >= 0 && slot < config.MAX_ITEMS;
    }
    hasItem(socket, slot) {
        return this.isItem(socket.character.items[slot]);
    }
    isItem(item) {
        return !!item.type;
    }
}
exports.default = ItemsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvaXRlbXMvaXRlbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXBFLHFCQUFxQyxTQUFRLDJCQUFnQjtJQUV6RCxxQkFBcUIsQ0FBQyxNQUFrQjtRQUNwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsS0FBSyxDQUFDO1lBQ1AsQ0FBQztRQUNGLENBQUM7UUFDSyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBZ0I7UUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjtBQXRCRCxrQ0FzQkM7QUFBQSxDQUFDIn0=