"use strict";
const master_model_1 = require("../master/master.model");
const _ = require('underscore');
const items_model_1 = require("../items/items.model");
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
        equips["chest"] = new ItemModel({
            name: "Chest of Elad",
            icon: "chest_of_elad",
            type: "chest"
        });
        this.listenForFieldAddition("Character", "equips", equips);
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EquipsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBQ2pELE1BQVksQ0FBQyxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ2hDLDhCQUEwQixzQkFBc0IsQ0FBQyxDQUFBO0FBRXBDLHFCQUFhLEdBQUc7SUFDekIsSUFBSSxFQUFFLHlCQUFXO0lBQ2pCLEtBQUssRUFBRSx5QkFBVztJQUNsQixJQUFJLEVBQUUseUJBQVc7SUFDakIsTUFBTSxFQUFFLHlCQUFXO0lBQ25CLEtBQUssRUFBRSx5QkFBVztDQUNyQixDQUFDO0FBRUYsMEJBQXlDLHNCQUFXO0lBQ2hELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RELENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDNUIsSUFBSSxFQUFFLGVBQWU7WUFDckIsSUFBSSxFQUFFLGVBQWU7WUFDckIsSUFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0FBQ0wsQ0FBQztBQTlCRDs2QkE4QkMsQ0FBQTtBQUFBLENBQUMifQ==