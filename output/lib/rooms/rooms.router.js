'use strict';
const socketio_router_base_1 = require("../socketio/socketio.router.base");
const _ = require("underscore");
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;
class RoomsRouter extends socketio_router_base_1.default {
    [SERVER_GETS.ENTERED_ROOM](data, socket) {
        // const also used in items
        console.log('logged user successfully');
        let room = socket.character.room;
        socket.broadcast.to(room).emit(this.CLIENT_GETS.JOIN_ROOM, { character: socket.character });
        let roomClients = this.io.sockets.adapter.rooms[room];
        if (roomClients) {
            _.each(roomClients.sockets, (value, socketId) => {
                socket.emit(this.CLIENT_GETS.JOIN_ROOM, { character: socket.map.get(socketId).character });
            });
        }
        socket.join(room);
    }
    [SERVER_GETS.MOVE_ROOM](data, socket) {
        console.log('moving user room');
        if (this.middleware.canEnterRoom(data.room, socket.character.room)) {
            socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character });
            let oldRoom = socket.character.room;
            socket.leave(oldRoom);
            socket.character.room = data.room;
            socket.emit(this.CLIENT_GETS.MOVE_ROOM, { oldRoom, room: data.room });
        }
    }
    [SERVER_GETS.DISCONNECT](data, socket) {
        console.log('disconnect');
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, { character: socket.character });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9yb29tcy9yb29tcy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsMkVBQWtFO0FBQ2xFLGdDQUFnQztBQUNoQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFHckYsaUJBQWlDLFNBQVEsOEJBQWtCO0lBQzFELENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUNsRCwyQkFBMkI7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUMxRixJQUFJLFdBQVcsR0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQWdCO2dCQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7WUFDMUYsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQzdHLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0YsQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQzlHLENBQUM7Q0FDRDs7QUE5QkQsOEJBOEJDO0FBQUEsQ0FBQyJ9