"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = EquipsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFDakQsZ0NBQWdDO0FBQ2hDLHNEQUFtRDtBQUNuRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztBQUVsRCxRQUFBLGFBQWEsR0FBRztJQUN6QixJQUFJLEVBQUUseUJBQVc7SUFDakIsS0FBSyxFQUFFLHlCQUFXO0lBQ2xCLElBQUksRUFBRSx5QkFBVztJQUNqQixNQUFNLEVBQUUseUJBQVc7SUFDbkIsS0FBSyxFQUFFLHlCQUFXO0lBQ2xCLE1BQU0sRUFBRSx5QkFBVztDQUN0QixDQUFDO0FBRUYsaUJBQWlDLFNBQVEsc0JBQVc7SUFDaEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDdEQsQ0FBQztRQUNLLHlCQUFZLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDbEUsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUM7UUFDcEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUExQkQsOEJBMEJDO0FBQUEsQ0FBQyJ9