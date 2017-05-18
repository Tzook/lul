'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
const _ = require("underscore");
const DROP_PRECISE = 10000;
class DropsController extends master_controller_1.default {
    getItemId(socket, itemId) {
        return `${socket.character.room}-${itemId}`;
    }
    isDropped(chance) {
        let rand = _.random(DROP_PRECISE);
        let rolled = rand * 100 / DROP_PRECISE;
        return true;
    }
}
exports.default = DropsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvZHJvcHMvZHJvcHMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELGdDQUFnQztBQUVoQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFFM0IscUJBQXFDLFNBQVEsMkJBQWdCO0lBQ2xELFNBQVMsQ0FBQyxNQUFrQixFQUFFLE1BQWM7UUFDL0MsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVNLFNBQVMsQ0FBQyxNQUFjO1FBQzNCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFWRCxrQ0FVQztBQUFBLENBQUMifQ==