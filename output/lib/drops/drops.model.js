"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
exports.DROP_SCHEMA = {
    key: String,
    chance: String,
};
class DropsModel extends master_model_1.default {
    init(files, app) {
        this.schema = exports.DROP_SCHEMA;
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", { drops: [this.getModel().schema] });
        return Promise.resolve();
    }
}
exports.default = DropsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2Ryb3BzL2Ryb3BzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFcEMsUUFBQSxXQUFXLEdBQUc7SUFDdkIsR0FBRyxFQUFFLE1BQU07SUFDWCxNQUFNLEVBQUUsTUFBTTtDQUNqQixDQUFDO0FBRUYsZ0JBQWdDLFNBQVEsc0JBQVc7SUFDL0MsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBVyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQWRELDZCQWNDO0FBQUEsQ0FBQyJ9