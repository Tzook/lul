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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHlEQUFpRDtBQUNqRCxnQ0FBZ0M7QUFDaEMsc0RBQW1EO0FBQ25ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRWxELFFBQUEsYUFBYSxHQUFHO0lBQ3pCLElBQUksRUFBRSx5QkFBVztJQUNqQixLQUFLLEVBQUUseUJBQVc7SUFDbEIsSUFBSSxFQUFFLHlCQUFXO0lBQ2pCLE1BQU0sRUFBRSx5QkFBVztJQUNuQixLQUFLLEVBQUUseUJBQVc7Q0FDckIsQ0FBQztBQUVGLGlCQUFpQyxTQUFRLHNCQUFXO0lBQ2hELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RELENBQUM7UUFDSyx5QkFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQWEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNKOztBQTFCRCw4QkEwQkM7QUFBQSxDQUFDIn0=