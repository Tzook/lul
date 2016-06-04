'use strict';
class MasterRouter {
    init(files, app) {
        this.controller = files.controller;
        this.middleware = files.middleware;
        this.ROUTES = files.config.ROUTES;
        this.logger = app.logger;
        this.initRoutes(app);
    }
    initRoutes(app) {
        // TODO inherit
    }
    get connection() {
        return undefined;
    }
    setConnection(con) {
        // TODO inherit
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MasterRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFzdGVyL21hc3Rlci5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBR2I7SUFNQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFHO1FBQ2IsZUFBZTtJQUNoQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ2IsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNsQixDQUFDO0lBQ0QsYUFBYSxDQUFDLEdBQUc7UUFDaEIsZUFBZTtJQUNoQixDQUFDO0FBQ0YsQ0FBQztBQXhCRDs4QkF3QkMsQ0FBQTtBQUFBLENBQUMifQ==