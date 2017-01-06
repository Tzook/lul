'use strict';
const master_model_1 = require("../master/master.model");
class UserModel extends master_model_1.default {
    init(files, app) {
        this.schema = {
            username: String,
            password: String
        };
        this.listenForSchemaAddition('User');
    }
    get priority() {
        return 1;
    }
    createModel() {
        this.setModel('User');
        this.removeListen('User');
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvdXNlci91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHlEQUFpRDtBQUVqRCxlQUErQixTQUFRLHNCQUFXO0lBRTlDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDVixRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsTUFBTTtTQUNuQixDQUFDO1FBQ0YsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7O0FBbkJELDRCQW1CQztBQUFBLENBQUMifQ==