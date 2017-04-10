'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/mobs/mobs.config.json').SERVER_GETS;
class MobsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.roomsRouter = files.routers.rooms;
        super.init(files, app);
    }
    initRoutes(app) {
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateMobs.bind(this.controller));
    }
    [SERVER_GETS.MOB_TAKE_DMG](data, socket) {
        // TODO
    }
    [SERVER_GETS.MOB_MOVE](data, socket) {
        // TODO
    }
}
exports.default = MobsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vYnMvbW9icy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUlsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFdkYsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBS3pELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFHO1FBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUNsRCxPQUFPO0lBQ1IsQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUM5QyxPQUFPO0lBQ1IsQ0FBQztDQUNEO0FBdkJELDZCQXVCQztBQUFBLENBQUMifQ==