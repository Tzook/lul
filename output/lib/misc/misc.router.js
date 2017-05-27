'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let questsConfig = require('../../../server/lib/quests/quests.config.json');
let config = require('../../../server/lib/misc/misc.config.json');
class MiscRouter extends socketio_router_base_1.default {
    init(files, app) {
        super.init(files, app);
        this.itemsRouter = files.routers.items;
    }
    [config.SERVER_GETS.ITEM_PICK.name](data, socket) {
        this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item) => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!(itemInfo.cap > 1) || itemInfo.key === "gold") {
                return;
            }
            let stack = item.stack;
            let slots = this.middleware.getStackSlots(socket, item, itemInfo);
            console.log("picking up item for slots", item, slots);
            if (slots.length === 0) {
                this.sendError(data, socket, "No available slots to pick misc item");
            }
            else {
                this.controller.pickMiscItem(socket, slots, item, itemInfo);
                this.emitter.emit(questsConfig.SERVER_INNER.LOOT_VALUE_CHANGE.name, { id: item.key, value: stack || 1 }, socket);
                return true;
            }
        });
    }
    [config.SERVER_GETS.MISC_DROP.name](data, socket) {
    }
}
exports.default = MiscRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21pc2MvbWlzYy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUtsRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUM1RSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQztBQUVsRSxnQkFBZ0MsU0FBUSw4QkFBa0I7SUFLekQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUN4QyxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFtQjtZQUNuRixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWxFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLHNDQUFzQyxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7Z0JBQzlHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO0lBc0I1RCxDQUFDO0NBQ0Q7QUFyREQsNkJBcURDO0FBQUEsQ0FBQyJ9