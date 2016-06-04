'use strict';
/**
 * Base router
 */
class RouterBase {
    /**
     * Initializes the instance
     */
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
module.exports = RouterBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFzdGVyL21hc3Rlci5yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBRWI7O0dBRUc7QUFDSDtJQUNDOztPQUVHO0lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBRztRQUNiLGVBQWU7SUFDaEIsQ0FBQztJQUVELElBQUksVUFBVTtRQUNiLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbEIsQ0FBQztJQUNELGFBQWEsQ0FBQyxHQUFHO1FBQ2hCLGVBQWU7SUFDaEIsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyJ9