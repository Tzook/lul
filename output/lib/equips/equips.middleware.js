'use strict';
const items_middleware_1 = require('../items/items.middleware');
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EquipsMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2VxdWlwcy9lcXVpcHMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixtQ0FBNEIsMkJBQTJCLENBQUMsQ0FBQTtBQUN4RCwrQkFBNEIsZ0JBQWdCLENBQUMsQ0FBQTtBQUU3QywrQkFBOEMsMEJBQWU7SUFDekQsZ0JBQWdCLENBQUMsSUFBWTtRQUN6QixNQUFNLENBQUMsSUFBSSxJQUFJLDRCQUFhLENBQUM7SUFDakMsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQVU7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFrQixFQUFFLElBQVk7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVUsRUFBRSxJQUFZO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsTUFBa0IsRUFBRSxRQUFnQixFQUFFLFNBQWlCO1FBQ3BFLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7QUFDTCxDQUFDO0FBdkJEO2tDQXVCQyxDQUFBO0FBQUEsQ0FBQyJ9