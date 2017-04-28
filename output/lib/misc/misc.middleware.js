'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const items_middleware_1 = require("../items/items.middleware");
let itemsConfig = require('../../../server/lib/items/items.config.json');
class MiscMiddleware extends items_middleware_1.default {
    getStackSlots(socket, item, itemInfo) {
        let { stack } = item;
        let slots = [];
        for (var slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
            if (!this.hasItem(socket, slot)) {
                slots.push(slot);
                stack -= itemInfo.cap;
            }
            let slotItem = socket.character.items[slot];
            if (slotItem.key === item.key && slotItem.stack < itemInfo.cap) {
                slots.push(slot);
                stack -= (itemInfo.cap - slotItem.stack);
            }
            if (stack <= 0) {
                break;
            }
        }
        return stack <= 0 ? slots : [];
    }
}
exports.default = MiscMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9taXNjL21pc2MubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsZ0VBQXdEO0FBQ3hELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXpFLG9CQUFvQyxTQUFRLDBCQUFlO0lBQ2hELGFBQWEsQ0FBQyxNQUFrQixFQUFFLElBQW1CLEVBQUUsUUFBb0I7UUFDOUUsSUFBSSxFQUFDLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMvRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDTCxLQUFLLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxDQUFDO1lBRVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUssQ0FBQztZQUNWLENBQUM7UUFDWCxDQUFDO1FBQ0ssTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUF0QkQsaUNBc0JDO0FBQUEsQ0FBQyJ9