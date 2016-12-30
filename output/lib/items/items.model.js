"use strict";
const master_model_1 = require("../master/master.model");
let config = require('../../../server/lib/items/items.config.json');
exports.ITEM_SCHEMA = {
    name: String,
    icon: String,
    type: String,
};
class ItemsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = exports.ITEM_SCHEMA;
    }
    get priority() {
        return 25;
    }
    createModel() {
        this.setModel("Item");
        this.addToSchema("Character", { items: [this.getModel().schema] });
        let items = [
            new this.model({
                name: "Sword of Elad",
                icon: "sword_of_elad"
            })
        ];
        for (var i = 1; i < config.MAX_ITEMS; i++) {
            items[i] = new this.model({});
        }
        this.listenForFieldAddition("Character", "items", items);
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBQ2pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXZELG1CQUFXLEdBQUc7SUFDdkIsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0NBQ2YsQ0FBQztBQUVGLHlCQUF3QyxzQkFBVztJQUMvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsTUFBTSxHQUFHLG1CQUFXLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksS0FBSyxHQUFHO1lBQ2pCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDZCxJQUFJLEVBQUUsZUFBZTtnQkFDckIsSUFBSSxFQUFFLGVBQWU7YUFDckIsQ0FBQztTQUNGLENBQUM7UUFDSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN4QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7QUFDTCxDQUFDO0FBMUJEOzRCQTBCQyxDQUFBO0FBQUEsQ0FBQyJ9