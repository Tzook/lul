'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class ItemsController extends master_controller_1.default {
    getItemId(socket, itemId) {
        return `${socket.character.room}-${itemId}`;
    }
}
exports.default = ItemsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvaXRlbXMvaXRlbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUNsRCxTQUFTLENBQUMsTUFBa0IsRUFBRSxNQUFjO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ2hELENBQUM7Q0FDSjtBQUpELGtDQUlDO0FBQUEsQ0FBQyJ9