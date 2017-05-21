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
                socket.emit(config.CLIENT_GETS.STACK_CHANGE.name, { slot, amount: slotItem.stack });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9taXNjL21pc2MuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3pFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBRWxFLG9CQUFvQyxTQUFRLDJCQUFnQjtJQUczRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDcEMsQ0FBQztJQUVTLFlBQVksQ0FBQyxNQUFrQixFQUFFLEtBQWUsRUFBRSxJQUFtQixFQUFFLFFBQW9CO1FBQzlGLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JFLFFBQVEsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQztnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3hGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDN0UsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBMUJELGlDQTBCQztBQUFBLENBQUMifQ==