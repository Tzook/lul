'use strict';
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/emote/emote.config.json').SERVER_GETS;
class EmoteRouter extends socketio_router_base_1.default {
    [SERVER_GETS.EMOTE](data, socket) {
        console.log("got an emote", socket.character.name, data);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.EMOTE, {
            id: socket.character._id,
            type: data.type,
            emote: data.emote,
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EmoteRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vdGUucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lbW90ZSBjb3B5L2Vtb3RlLnJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYiwyRUFBa0U7QUFDbEUsSUFBSSxXQUFXLEdBQU8sT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRXpGLGlCQUFpQyxTQUFRLDhCQUFrQjtJQUMxRCxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDdkUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRztZQUN4QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDakIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEOztBQVRELDhCQVNDO0FBQUEsQ0FBQyJ9