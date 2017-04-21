'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const items_middleware_1 = require("../items/items.middleware");
const equips_model_1 = require("./equips.model");
class EquipsMiddleware extends items_middleware_1.default {
    isValidEquipSlot(slot) {
        return slot in equips_model_1.EQUIPS_SCHEMA;
    }
    isValidEquipItem(item) {
        return this.isValidEquipSlot(item.type);
    }
    hasEquip(socket, slot) {
        return this.isItem(socket.character.equips[slot]);
    }
    canWearEquip(item, slot) {
        return item.type === slot;
    }
    swapEquipAndItem(socket, itemSlot, equipSlot) {
        let item = socket.character.items[itemSlot];
        let currentEquip = socket.character.equips[equipSlot];
        socket.character.equips[equipSlot] = item;
        socket.character.items.set(itemSlot, currentEquip);
    }
}
exports.default = EquipsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2VxdWlwcy9lcXVpcHMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsZ0VBQXdEO0FBQ3hELGlEQUE2QztBQUU3QyxzQkFBc0MsU0FBUSwwQkFBZTtJQUN6RCxnQkFBZ0IsQ0FBQyxJQUFZO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLElBQUksNEJBQWEsQ0FBQztJQUNqQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBZ0I7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFrQixFQUFFLElBQVk7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQWdCLEVBQUUsSUFBWTtRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDOUIsQ0FBQztJQUVELGdCQUFnQixDQUFDLE1BQWtCLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQjtRQUNwRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7QUF2QkQsbUNBdUJDO0FBQUEsQ0FBQyJ9