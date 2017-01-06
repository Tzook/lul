'use strict';
const socketio_router_base_1 = require('../socketio/socketio.router.base');
let SERVER_GETS = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;
class ChatRouter extends socketio_router_base_1.default {
    [SERVER_GETS.SHOUT](data, socket) {
        console.log("Emitting shout", data);
        socket.broadcast.emit(this.CLIENT_GETS.SHOUT, {
            id: socket.character._id,
            msg: data.msg,
        });
    }
    [SERVER_GETS.CHAT](data, socket) {
        console.log("Emitting chat", data);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHAT, {
            id: socket.character._id,
            msg: data.msg,
        });
    }
    [SERVER_GETS.WHISPER](data, socket) {
        if (typeof data.to_id == 'string') {
            let targetSocket = socket.map.get(data.target_id);
            if (!targetSocket) {
                console.error("Failed to find socket for whisper!", data);
            }
            else {
                console.log("Emitting whisper", data);
                targetSocket.emit(this.CLIENT_GETS.WHISPER, {
                    id: socket.character._id,
                    msg: data.msg,
                });
            }
        }
        else {
            console.log("did not provide to_id in data for whisper!", data);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXQvY2hhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsdUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFDbEUsSUFBSSxXQUFXLEdBQU8sT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRXZGLHlCQUF3Qyw4QkFBa0I7SUFDekQsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtZQUM3QyxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO1lBQ3hCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNiLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRTtZQUN0RSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO1lBQ3hCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNiLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO29CQUMzQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO29CQUN4QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ2IsQ0FBQyxDQUFDO1lBQ0osQ0FBQztRQUNGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBakNEOzRCQWlDQyxDQUFBO0FBQUEsQ0FBQyJ9