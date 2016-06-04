'use strict';
const socketio_router_base_1 = require('../socketio/socketio.router.base');
let SERVER_GETS = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;
class ChatRouter extends socketio_router_base_1.default {
    [SERVER_GETS.MESSAGE](data, socket) {
        console.log("Got message", data);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.MESSAGE, {
            id: socket.character._id,
            message: data.message
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXQvY2hhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsdUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFDbEUsSUFBSSxXQUFXLEdBQU8sT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRXZGLHlCQUF3Qyw4QkFBa0I7SUFDekQsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7WUFDekUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztZQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDckIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztBQUNGLENBQUM7QUFSRDs0QkFRQyxDQUFBO0FBQUEsQ0FBQyJ9