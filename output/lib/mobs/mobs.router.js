'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/mobs/mobs.config.json').SERVER_GETS;
class MobsRouter extends socketio_router_base_1.default {
    initRoutes(app) {
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateMob.bind(this.controller));
    }
}
exports.default = MobsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vYnMvbW9icy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUdsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFdkYsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBSXpELFVBQVUsQ0FBQyxHQUFHO1FBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNEO0FBVEQsNkJBU0M7QUFBQSxDQUFDIn0=