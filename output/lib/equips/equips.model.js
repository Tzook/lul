"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const _ = require("underscore");
const items_model_1 = require("../items/items.model");
exports.EQUIPS_SCHEMA = {
    head: items_model_1.ITEM_INSTANCE_SCHEMA,
    chest: items_model_1.ITEM_INSTANCE_SCHEMA,
    legs: items_model_1.ITEM_INSTANCE_SCHEMA,
    gloves: items_model_1.ITEM_INSTANCE_SCHEMA,
    shoes: items_model_1.ITEM_INSTANCE_SCHEMA,
    weapon: items_model_1.ITEM_INSTANCE_SCHEMA,
};
class EquipsModel extends master_model_1.default {
    init(files, app) {
        this.socketioRouter = files.routers.socketio;
        this.itemsRouter = files.routers.items;
        this.hasId = false;
        this.schema = _.clone(exports.EQUIPS_SCHEMA);
        this.beginSchema = _.clone(exports.EQUIPS_SCHEMA);
        for (let i in this.schema) {
            this.schema[i] = this.mongoose.Schema.Types.Mixed;
            this.beginSchema[i] = String;
        }
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel("Equip");
        this.addToSchema("Character", { equips: this.getModel().schema });
        this.addToSchema("Config", { beginEquips: this.beginSchema });
        this.listenForFieldAddition("Character", "equips", () => {
            let equips = _.clone(exports.EQUIPS_SCHEMA);
            let ItemModel = this.getModel("ItemInstance");
            let config = this.socketioRouter.getConfig();
            for (let type in equips) {
                let itemInstance = this.itemsRouter.getItemInstance(config.beginEquips[type]) || {};
                equips[type] = new ItemModel(itemInstance);
            }
            return equips;
        });
        return Promise.resolve();
    }
}
exports.default = EquipsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFDakQsZ0NBQWdDO0FBQ2hDLHNEQUE0RDtBQUkvQyxRQUFBLGFBQWEsR0FBRztJQUN6QixJQUFJLEVBQUUsa0NBQW9CO0lBQzFCLEtBQUssRUFBRSxrQ0FBb0I7SUFDM0IsSUFBSSxFQUFFLGtDQUFvQjtJQUMxQixNQUFNLEVBQUUsa0NBQW9CO0lBQzVCLEtBQUssRUFBRSxrQ0FBb0I7SUFDM0IsTUFBTSxFQUFFLGtDQUFvQjtDQUMvQixDQUFDO0FBRUYsaUJBQWlDLFNBQVEsc0JBQVc7SUFLaEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2pCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQWEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2xELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtZQUMvQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztZQUNwQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEYsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUF4Q0QsOEJBd0NDO0FBQUEsQ0FBQyJ9