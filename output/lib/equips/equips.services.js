'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class EquipsServices extends master_services_1.default {
    init(files, app) {
        super.init(files, app);
        this.middleware = files.middleware;
        this.itemsRouter = files.routers.items;
        this.socketioRouter = files.routers.socketio;
    }
    beginEquips(items) {
        console.log("Generating begin equips from data:", items);
        let equips = {};
        for (let i = 0; i < (items || []).length; i++) {
            let itemKey = items[i] && items[i].key;
            let itemInfo = this.itemsRouter.getItemInfo(itemKey);
            if (!itemInfo) {
                return Promise.reject(`Item ${itemKey} does not exist.`);
            }
            if (equips[itemInfo.type]) {
                return Promise.reject(`Item type ${itemInfo.type} was provided more than once: ${equips[itemInfo.type]} and ${itemKey}.`);
            }
            if (!this.middleware.isValidEquipItem(itemInfo)) {
                return Promise.reject(`Item ${itemKey} is not an equip.`);
            }
            equips[itemInfo.type] = itemKey;
        }
        return Promise.resolve()
            .then(() => {
            let config = this.socketioRouter.getConfig();
            config.beginEquips = equips;
            return config.save();
        });
    }
}
exports.default = EquipsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFLdkQsb0JBQW9DLFNBQVEseUJBQWM7SUFJekQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUM5QyxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQXNCO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekQsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUV2QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ2hELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsUUFBUSxDQUFDLElBQUksaUNBQWlDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUM5SCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxPQUFPLG1CQUFtQixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3BDLENBQUM7UUFFUCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTthQUN0QixJQUFJLENBQUM7WUFDTyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDO0NBQ0Q7QUF0Q0QsaUNBc0NDO0FBQUEsQ0FBQyJ9