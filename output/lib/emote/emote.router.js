'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = EmoteRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vdGUucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9lbW90ZS9lbW90ZS5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUNsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFekYsaUJBQWlDLFNBQVEsOEJBQWtCO0lBQzFELENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtZQUN2RSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO1lBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNqQixDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUFURCw4QkFTQztBQUFBLENBQUMifQ==