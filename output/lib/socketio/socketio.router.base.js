'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_router_1 = require("../master/master.router");
class SocketioRouterBase extends master_router_1.default {
    init(files, app) {
        this.io = app.socketio;
        super.init(files, app);
        this.CLIENT_GETS = files.config.CLIENT_GETS;
        this.SERVER_GETS = files.config.SERVER_GETS || [];
        this.SERVER_INNER = files.config.SERVER_INNER || [];
    }
    onConnected(socket) {
    }
    set eventEmitter(emitter) {
        this.emitter = emitter;
    }
    get connection() {
        return 'socketio';
    }
}
exports.default = SocketioRouterBase;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0aW8ucm91dGVyLmJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3NvY2tldGlvL3NvY2tldGlvLnJvdXRlci5iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwyREFBbUQ7QUFHbkQsd0JBQXdDLFNBQVEsdUJBQVk7SUFPM0QsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVNLFdBQVcsQ0FBQyxNQUFrQjtJQUVyQyxDQUFDO0lBRUQsSUFBSSxZQUFZLENBQUMsT0FBTztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ2IsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNuQixDQUFDO0NBQ0Q7QUExQkQscUNBMEJDO0FBQUEsQ0FBQyJ9