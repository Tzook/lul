'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/movement/movement.config.json').SERVER_GETS;
class MovementRouter extends socketio_router_base_1.default {
    [SERVER_GETS.MOVEMENT](data, socket) {
        var position = socket.character.position;
        position.x = data.x;
        position.y = data.y;
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MOVEMENT, {
            id: socket.character._id,
            x: data.x,
            y: data.y,
            angle: data.angle
        });
    }
}
exports.default = MovementRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tb3ZlbWVudC9tb3ZlbWVudC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUNsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsbURBQW1ELENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFL0Ysb0JBQW9DLFNBQVEsOEJBQWtCO0lBQzdELENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUM5QyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUN6QyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzFFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQVpELGlDQVlDO0FBQUEsQ0FBQyJ9