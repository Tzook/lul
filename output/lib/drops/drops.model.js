"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class DropsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = {
            key: String,
            minStack: Number,
            maxStack: Number,
        };
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", { drops: [this.model.schema] });
        return Promise.resolve();
    }
}
exports.default = DropsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2Ryb3BzL2Ryb3BzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZ0JBQWdDLFNBQVEsc0JBQVc7SUFFL0MsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLEdBQUcsRUFBRSxNQUFNO1lBQ1gsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLE1BQU07U0FDbkIsQ0FBQztJQUNOLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFwQkQsNkJBb0JDO0FBQUEsQ0FBQyJ9