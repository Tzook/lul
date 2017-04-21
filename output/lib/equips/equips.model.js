"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const _ = require("underscore");
const items_model_1 = require("../items/items.model");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFDakQsZ0NBQWdDO0FBQ2hDLHNEQUFtRDtBQUV0QyxRQUFBLGFBQWEsR0FBRztJQUN6QixJQUFJLEVBQUUseUJBQVc7SUFDakIsS0FBSyxFQUFFLHlCQUFXO0lBQ2xCLElBQUksRUFBRSx5QkFBVztJQUNqQixNQUFNLEVBQUUseUJBQVc7SUFDbkIsS0FBSyxFQUFFLHlCQUFXO0lBQ2xCLE1BQU0sRUFBRSx5QkFBVztDQUN0QixDQUFDO0FBRUYsaUJBQWlDLFNBQVEsc0JBQVc7SUFDaEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDdEQsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQWEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBekJELDhCQXlCQztBQUFBLENBQUMifQ==