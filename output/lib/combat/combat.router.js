'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/combat/combat.config.json');
class CombatRouter extends socketio_router_base_1.default {
    [config.SERVER_GETS.LOAD_ATTACK](data, socket) {
        console.log("loading attack", socket.character.name);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility
        });
    }
    [config.SERVER_GETS.PERFORM_ATTACK](data, socket) {
        let load = this.middleware.getValidLoad(data.load);
        console.log("performing attack", socket.character.name, data, load);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility,
            load
        });
    }
}
exports.default = CombatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmF0LnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvY29tYmF0L2NvbWJhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUVsRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUV0RSxrQkFBa0MsU0FBUSw4QkFBa0I7SUFHM0QsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUU7WUFDN0UsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYztTQUM5QyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUMzRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7WUFDaEYsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYztZQUM5QyxJQUFJO1NBQ0osQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBcEJELCtCQW9CQztBQUFBLENBQUMifQ==