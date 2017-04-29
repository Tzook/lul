'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = require('../../../server/lib/gold/gold.config.json').SERVER_GETS;
class GoldRouter extends socketio_router_base_1.default {
    init(files, app) {
        super.init(files, app);
        this.itemsRouter = files.routers.items;
    }
    [SERVER_GETS.ITEM_PICK](data, socket) {
        this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK, data, socket, (item) => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (itemInfo.key !== "gold") {
                return;
            }
            socket.character.gold += item.stack;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD, {
                amount: item.stack
            });
            console.log("Gaining gold for %s. picked %d, now has: %d", socket.character.name, item.stack, socket.character.gold);
            return true;
        });
    }
    [SERVER_GETS.DROP_GOLD](data, socket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
        let { amount } = data;
        if (!(amount > 0)) {
            this.sendError(data, socket, "Must mention what gold amount to throw");
        }
        else {
            let amountToDrop = Math.min(amount, socket.character.gold);
            socket.character.gold -= amountToDrop;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD, {
                amount: -amountToDrop
            });
            let item = this.itemsRouter.getItemInstance("gold");
            item.stack = amountToDrop;
            console.log("dropping gold", item);
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP, {}, socket, [item]);
        }
    }
}
exports.default = GoldRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2dvbGQvZ29sZC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUdsRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFbkYsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBR3pELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDeEMsQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBbUI7WUFDOUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDdEMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ3JCLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JILE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksRUFBQyxNQUFNLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLHdDQUF3QyxDQUFDLENBQUM7UUFDM0UsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxZQUFZLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDdEMsTUFBTSxFQUFFLENBQUMsWUFBWTthQUN4QixDQUFDLENBQUM7WUFDSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvRSxDQUFDO0lBQ1IsQ0FBQztDQUNEO0FBM0NELDZCQTJDQztBQUFBLENBQUMifQ==