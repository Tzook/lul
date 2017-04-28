'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const items_middleware_1 = require("../items/items.middleware");
let itemsConfig = require('../../../server/lib/items/items.config.json');
class MiscMiddleware extends items_middleware_1.default {
    getStackSlots(socket, item, itemInfo) {
        let { stack } = item;
        let slots = [];
        for (let slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
            if (stack <= 0) {
                break;
            }
            let slotItem = socket.character.items[slot];
            if (slotItem.key === item.key && slotItem.stack < itemInfo.cap) {
                slots.push(slot);
                stack -= (itemInfo.cap - slotItem.stack);
            }
        }
        for (let slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
            if (stack <= 0) {
                break;
            }
            if (!this.hasItem(socket, slot)) {
                slots.push(slot);
                stack -= itemInfo.cap;
            }
        }
        return stack <= 0 ? slots : [];
    }
}
exports.default = MiscMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9taXNjL21pc2MubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsZ0VBQXdEO0FBQ3hELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXpFLG9CQUFvQyxTQUFRLDBCQUFlO0lBQ2hELGFBQWEsQ0FBQyxNQUFrQixFQUFFLElBQW1CLEVBQUUsUUFBb0I7UUFDOUUsSUFBSSxFQUFDLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFZixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUM7WUFDVixDQUFDO1lBQ0QsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsQ0FBQztRQUNYLENBQUM7UUFHSyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUM7WUFDVixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsS0FBSyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDbkMsQ0FBQztRQUNJLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQTdCRCxpQ0E2QkM7QUFBQSxDQUFDIn0=