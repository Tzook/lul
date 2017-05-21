'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/combat/combat.config.json');
class CombatRouter extends socketio_router_base_1.default {
    [config.SERVER_GETS.LOAD_ATTACK.name](data, socket) {
        console.log("loading attack", socket.character.name);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK.name, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility
        });
    }
    [config.SERVER_GETS.PERFORM_ATTACK.name](data, socket) {
        let load = this.middleware.getValidLoad(data.load);
        socket.lastAttackLoad = load;
        console.log("performing attack", socket.character.name, data, load);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK.name, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility,
            load
        });
    }
}
exports.default = CombatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmF0LnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvY29tYmF0L2NvbWJhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUVsRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUV0RSxrQkFBa0MsU0FBUSw4QkFBa0I7SUFHM0QsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRTtZQUNsRixFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjO1NBQzlDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUNoRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFO1lBQ3JGLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWM7WUFDOUMsSUFBSTtTQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQXJCRCwrQkFxQkM7QUFBQSxDQUFDIn0=