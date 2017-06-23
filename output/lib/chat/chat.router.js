'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;
class ChatRouter extends socketio_router_base_1.default {
    [SERVER_GETS.SHOUT.name](data, socket) {
        socket.broadcast.emit(this.CLIENT_GETS.SHOUT.name, {
            id: socket.character._id,
            msg: data.msg,
        });
    }
    [SERVER_GETS.CHAT.name](data, socket) {
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHAT.name, {
            id: socket.character._id,
            msg: data.msg,
        });
    }
    [SERVER_GETS.WHISPER.name](data, socket) {
        let targetSocket = socket.map.get(data.to);
        if (!targetSocket) {
            this.sendError(data, socket, "Failed to find socket for whisper");
        }
        else {
            targetSocket.emit(this.CLIENT_GETS.WHISPER.name, {
                name: socket.character.name,
                msg: data.msg,
            });
        }
    }
}
exports.default = ChatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXQvY2hhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUNsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFdkYsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBQ3pELENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2xELEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzNFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDbEQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDaEQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSTtnQkFDM0IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2FBQ2IsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNGLENBQUM7Q0FDRDtBQTFCRCw2QkEwQkM7QUFBQSxDQUFDIn0=