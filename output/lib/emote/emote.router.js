'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/emote/emote.config.json').SERVER_GETS;
class EmoteRouter extends socketio_router_base_1.default {
    [SERVER_GETS.EMOTE.name](data, socket) {
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.EMOTE.name, {
            id: socket.character._id,
            type: data.type,
            emote: data.emote,
        });
    }
}
exports.default = EmoteRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vdGUucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lbW90ZS9lbW90ZS5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUNsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFekYsaUJBQWlDLFNBQVEsOEJBQWtCO0lBQzFELENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQzVFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQVJELDhCQVFDO0FBQUEsQ0FBQyJ9