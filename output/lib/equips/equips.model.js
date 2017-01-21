"use strict";
const master_model_1 = require("../master/master.model");
const _ = require("underscore");
const items_model_1 = require("../items/items.model");
let EQUIPS = require('../../../server/lib/equips/equips.json');
exports.EQUIPS_SCHEMA = {
    head: items_model_1.ITEM_SCHEMA,
    chest: items_model_1.ITEM_SCHEMA,
    legs: items_model_1.ITEM_SCHEMA,
    gloves: items_model_1.ITEM_SCHEMA,
    shoes: items_model_1.ITEM_SCHEMA,
    weapon: items_model_1.ITEM_SCHEMA,
};
class EquipsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = _.clone(exports.EQUIPS_SCHEMA);
        for (let i in this.schema) {
            this.schema[i] = this.mongoose.Schema.Types.Mixed;
        }
        items_model_1.ITEM_SCHEMA.sprites = this.mongoose.Schema.Types.Mixed;
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel("Equip");
        this.addToSchema("Character", { equips: this.getModel().schema });
        let equips = _.clone(exports.EQUIPS_SCHEMA);
        let ItemModel = this.getModel("Item");
        for (let i in equips) {
            equips[i] = new ItemModel({});
        }
        this.listenForFieldAddition("Character", "equips", equips);
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EquipsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHlEQUFpRDtBQUNqRCxnQ0FBZ0M7QUFDaEMsc0RBQW1EO0FBQ25ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRWxELFFBQUEsYUFBYSxHQUFHO0lBQ3pCLElBQUksRUFBRSx5QkFBVztJQUNqQixLQUFLLEVBQUUseUJBQVc7SUFDbEIsSUFBSSxFQUFFLHlCQUFXO0lBQ2pCLE1BQU0sRUFBRSx5QkFBVztJQUNuQixLQUFLLEVBQUUseUJBQVc7SUFDbEIsTUFBTSxFQUFFLHlCQUFXO0NBQ3RCLENBQUM7QUFFRixpQkFBaUMsU0FBUSxzQkFBVztJQUNoRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQWEsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN0RCxDQUFDO1FBQ0sseUJBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUNsRSxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjs7QUExQkQsOEJBMEJDO0FBQUEsQ0FBQyJ9