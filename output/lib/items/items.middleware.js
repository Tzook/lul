'use strict';
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
        return !!item.name;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvaXRlbXMvaXRlbXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixtRUFBMkQ7QUFDM0QsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFcEUscUJBQXFDLFNBQVEsMkJBQWdCO0lBRXpELHFCQUFxQixDQUFDLE1BQWtCO1FBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLENBQUM7WUFDUCxDQUFDO1FBQ0YsQ0FBQztRQUNLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFZO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2hELENBQUM7SUFFRCxPQUFPLENBQUMsTUFBa0IsRUFBRSxJQUFZO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFVO1FBQ2IsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjs7QUF0QkQsa0NBc0JDO0FBQUEsQ0FBQyJ9