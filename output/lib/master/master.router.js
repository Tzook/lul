Object.defineProperty(exports, "__esModule", { value: true });
class MasterRouter {
    init(files, app) {
        this.controller = files.controller;
        this.middleware = files.middleware;
        this.ROUTES = files.config.ROUTES;
        this.initRoutes(app);
    }
    initRoutes(app) {
    }
    get connection() {
        return undefined;
    }
}
exports.default = MasterRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFzdGVyL21hc3Rlci5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0lBS0MsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLFVBQVUsQ0FBQyxHQUFHO0lBRXhCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDYixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2xCLENBQUM7Q0FDRDtBQW5CRCwrQkFtQkM7QUFBQSxDQUFDIn0=