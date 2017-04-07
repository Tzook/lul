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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2VxdWlwcy9lcXVpcHMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsZ0VBQXdEO0FBQ3hELGlEQUE2QztBQUU3QyxzQkFBc0MsU0FBUSwwQkFBZTtJQUN6RCxnQkFBZ0IsQ0FBQyxJQUFZO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLElBQUksNEJBQWEsQ0FBQztJQUNqQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBVTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxZQUFZLENBQUMsSUFBVSxFQUFFLElBQVk7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFrQixFQUFFLFFBQWdCLEVBQUUsU0FBaUI7UUFDcEUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNKO0FBdkJELG1DQXVCQztBQUFBLENBQUMifQ==