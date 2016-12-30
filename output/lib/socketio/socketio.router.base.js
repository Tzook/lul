'use strict';
const master_router_1 = require('../master/master.router');
class SocketioRouterBase extends master_router_1.default {
    init(files, app) {
        super.init(files, app);
        this.io = app.socketio;
        this.CLIENT_GETS = files.config.CLIENT_GETS;
        this.SERVER_GETS = files.config.SERVER_GETS;
    }
    set eventEmitter(emitter) {
        this.emitter = emitter;
    }
    get connection() {
        return 'socketio';
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SocketioRouterBase;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0aW8ucm91dGVyLmJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3NvY2tldGlvL3NvY2tldGlvLnJvdXRlci5iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLGdDQUF5Qix5QkFBeUIsQ0FBQyxDQUFBO0FBR25ELGlDQUFnRCx1QkFBWTtJQU0zRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLFlBQVksQ0FBQyxPQUFPO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDYixNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ25CLENBQUM7QUFDRixDQUFDO0FBcEJEO29DQW9CQyxDQUFBO0FBQUEsQ0FBQyJ9