"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class GoldModel extends master_model_1.default {
    get priority() {
        return 20;
    }
    createModel() {
        this.addToSchema("Character", { gold: { type: Number, default: 0 } });
        return Promise.resolve();
    }
}
exports.default = GoldModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvZ29sZC9nb2xkLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZUFBK0IsU0FBUSxzQkFBVztJQUM5QyxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQVRELDRCQVNDO0FBQUEsQ0FBQyJ9