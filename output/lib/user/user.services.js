'use strict';
const master_services_1 = require('../master/master.services');
class UserServices extends master_services_1.default {
    saveNewUser(body) {
        return this.Q.ninvoke(new this.Model(body), 'save');
    }
    getUser(username) {
        return this.Q.ninvoke(this.Model, 'findOne', { username });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvdXNlci91c2VyLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLGtDQUEyQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRXZELDJCQUEwQyx5QkFBYztJQUVwRCxXQUFXLENBQUMsSUFBSTtRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFRO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0wsQ0FBQztBQVREOzhCQVNDLENBQUE7QUFBQSxDQUFDIn0=