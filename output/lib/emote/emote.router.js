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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vdGUucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lbW90ZS9lbW90ZS5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsMkVBQWtFO0FBQ2xFLElBQUksV0FBVyxHQUFPLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUV6RixpQkFBaUMsU0FBUSw4QkFBa0I7SUFDMUQsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO1lBQ3ZFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDs7QUFURCw4QkFTQztBQUFBLENBQUMifQ==