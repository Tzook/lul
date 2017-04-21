"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
let config = require('../../../server/lib/items/items.config.json');
exports.ITEM_SCHEMA = {
    key: String,
    type: String,
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
        this.addToSchema("Character", { items: [this.getModel().schema] });
        let items = [];
        for (var i = items.length; i < config.MAX_ITEMS; i++) {
            items[i] = new this.model({});
        }
        this.listenForFieldAddition("Character", "items", items);
        setTimeout(() => this.controller.warmItemsInfo());
        return Promise.resolve();
    }
}
exports.default = ItemsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFdkQsUUFBQSxXQUFXLEdBQUc7SUFDdkIsR0FBRyxFQUFFLE1BQU07SUFDWCxJQUFJLEVBQUUsTUFBTTtDQUNmLENBQUM7QUFFRixnQkFBZ0MsU0FBUSxzQkFBVztJQUcvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBVyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLEtBQUssR0FBRyxFQVNqQixDQUFDO1FBQ0ksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25ELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pELFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQWpDRCw2QkFpQ0M7QUFBQSxDQUFDIn0=