"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
let config = require('../../../server/lib/items/items.config.json');
exports.ITEM_SCHEMA = {
    key: String,
    type: String,
    gold: Number,
    chance: Number,
};
exports.ITEM_INSTANCE_SCHEMA = {
    key: String,
};
class ItemsModel extends master_model_1.default {
    init(files, app) {
        this.controller = files.controller;
        this.schema = exports.ITEM_SCHEMA;
    }
    get priority() {
        return 25;
    }
    createModel() {
        this.setModel("Item");
        let ItemInstanceModel = this.createNewModel("ItemInstance", exports.ITEM_INSTANCE_SCHEMA, { _id: false });
        this.addToSchema("Character", { items: [ItemInstanceModel.schema] });
        let items = [];
        for (var i = 0; i < config.MAX_ITEMS; i++) {
            items[i] = new ItemInstanceModel({});
        }
        this.listenForFieldAddition("Character", "items", items);
        setTimeout(() => this.controller.warmItemsInfo());
        return Promise.resolve();
    }
}
exports.default = ItemsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFdkQsUUFBQSxXQUFXLEdBQUc7SUFDdkIsR0FBRyxFQUFFLE1BQU07SUFDWCxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLE1BQU07Q0FDakIsQ0FBQztBQUVXLFFBQUEsb0JBQW9CLEdBQUc7SUFDaEMsR0FBRyxFQUFFLE1BQU07Q0FDZCxDQUFBO0FBRUQsZ0JBQWdDLFNBQVEsc0JBQVc7SUFHL0MsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsbUJBQVcsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLDRCQUFvQixFQUFFLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpELFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQTNCRCw2QkEyQkM7QUFBQSxDQUFDIn0=