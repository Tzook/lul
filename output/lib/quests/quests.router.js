'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
class QuestsRouter extends socketio_router_base_1.default {
    initRoutes(app) {
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateQuests.bind(this.controller));
    }
}
exports.default = QuestsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcXVlc3RzL3F1ZXN0cy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUtsRSxrQkFBa0MsU0FBUSw4QkFBa0I7SUFLakQsVUFBVSxDQUFDLEdBQUc7UUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBVkQsK0JBVUM7QUFBQSxDQUFDIn0=