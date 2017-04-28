'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
let itemsConfig = require('../../../server/lib/items/items.config.json');
let config = require('../../../server/lib/misc/misc.config.json');
class MiscController extends master_controller_1.default {
    init(files, app) {
        super.init(files, app);
        this.middleware = files.middleware;
    }
    pickMiscItem(socket, slots, item, itemInfo) {
        slots.forEach(slot => {
            if (this.middleware.hasItem(socket, slot)) {
                let slotItem = socket.character.items[slot];
                let stackToAdd = Math.min(item.stack, itemInfo.cap - slotItem.stack);
                slotItem.stack += stackToAdd;
                socket.character.items.set(slot, slotItem);
                item.stack -= stackToAdd;
                socket.emit(config.CLIENT_GETS.STACK_CHANGE, { slot, stack: slotItem.stack });
            }
            else {
                let itemClone = Object.assign({}, item);
                itemClone.stack = Math.min(item.stack, itemInfo.cap);
                socket.character.items.set(slot, itemClone);
                item.stack -= itemClone.stack;
                socket.emit(itemsConfig.CLIENT_GETS.ITEM_ADD, { slot, item: itemClone });
            }
        });
    }
}
exports.default = MiscController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9taXNjL21pc2MuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3pFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBRWxFLG9CQUFvQyxTQUFRLDJCQUFnQjtJQUczRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDcEMsQ0FBQztJQUVTLFlBQVksQ0FBQyxNQUFrQixFQUFFLEtBQWUsRUFBRSxJQUFtQixFQUFFLFFBQW9CO1FBQzlGLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JFLFFBQVEsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQztnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEYsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM3RSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUExQkQsaUNBMEJDO0FBQUEsQ0FBQyJ9