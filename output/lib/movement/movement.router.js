'use strict';
const socketio_router_base_1 = require('../socketio/socketio.router.base');
let SERVER_GETS = require('../../../server/lib/movement/movement.config.json').SERVER_GETS;
class MovementRouter extends socketio_router_base_1.default {
    [SERVER_GETS.MOVEMENT](data, socket) {
        console.log("Got movement", data);
        var position = socket.character.position;
        position.x = data.x;
        position.y = data.y;
        position.z = data.z;
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MOVEMENT, {
            id: socket.character._id,
            x: data.x,
            y: data.y,
            z: data.z,
            angle: data.angle
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovementRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tb3ZlbWVudC9tb3ZlbWVudC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsdUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFDbEUsSUFBSSxXQUFXLEdBQU8sT0FBTyxDQUFDLG1EQUFtRCxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRS9GLDZCQUE0Qyw4QkFBa0I7SUFDN0QsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzFFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7QUFDRixDQUFDO0FBZkQ7Z0NBZUMsQ0FBQTtBQUFBLENBQUMifQ==