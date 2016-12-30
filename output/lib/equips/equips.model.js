"use strict";
const master_model_1 = require("../master/master.model");
const _ = require('underscore');
const items_model_1 = require("../items/items.model");
class EquipsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = {
            head: items_model_1.ITEM_SCHEMA,
            chest: items_model_1.ITEM_SCHEMA,
            legs: items_model_1.ITEM_SCHEMA,
            gloves: items_model_1.ITEM_SCHEMA,
            shoes: items_model_1.ITEM_SCHEMA,
        };
    }
    get priority() {
        return 30;
    }
    createModel() {
        this.setModel("Equip");
        this.addToSchema("Character", { equips: this.getModel().schema });
        let equips = _.clone(this.schema);
        for (let i in equips) {
            equips[i] = {};
        }
        this.listenForFieldAddition("Character", "equips", equips);
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EquipsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lcXVpcHMvZXF1aXBzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBQ2pELE1BQVksQ0FBQyxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ2hDLDhCQUEwQixzQkFBc0IsQ0FBQyxDQUFBO0FBRWpELDBCQUF5QyxzQkFBVztJQUNoRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsSUFBSSxFQUFFLHlCQUFXO1lBQ2pCLEtBQUssRUFBRSx5QkFBVztZQUNsQixJQUFJLEVBQUUseUJBQVc7WUFDakIsTUFBTSxFQUFFLHlCQUFXO1lBQ25CLEtBQUssRUFBRSx5QkFBVztTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7QUFDTCxDQUFDO0FBM0JEOzZCQTJCQyxDQUFBO0FBQUEsQ0FBQyJ9