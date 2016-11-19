'use strict';
const socketio_router_base_1 = require('../socketio/socketio.router.base');
let SERVER_GETS = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;
class ChatRouter extends socketio_router_base_1.default {
    [SERVER_GETS.MESSAGE](data, socket) {
        let emit = to => {
            to.emit(this.CLIENT_GETS.MESSAGE, {
                id: socket.character._id,
                message: data.message,
                type: data.type
            });
        };
        console.log("Got message", data);
        if (data.type === "whisper" && data.target_id) {
            let targetSocket = socket.map.get(data.target_id);
            if (!targetSocket) {
                console.error("Failed to find socket!", data);
            }
            else {
                emit(targetSocket);
            }
        }
        else if (data.type === "global") {
            emit(socket.broadcast);
        }
        else {
            emit(socket.broadcast.to(socket.character.room));
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXQvY2hhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsdUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFDbEUsSUFBSSxXQUFXLEdBQU8sT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRXZGLHlCQUF3Qyw4QkFBa0I7SUFDekQsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDakMsSUFBSSxJQUFJLEdBQUcsRUFBRTtZQUNaLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2YsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFBO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDRixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBeEJEOzRCQXdCQyxDQUFBO0FBQUEsQ0FBQyJ9