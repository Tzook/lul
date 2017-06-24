'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/chat/chat.config.json').SERVER_GETS;
class ChatRouter extends socketio_router_base_1.default {
    init(files, app) {
        super.init(files, app);
        this.partyRouter = files.routers.party;
    }
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
    [SERVER_GETS.PARTY_CHAT.name](data, socket) {
        const party = this.partyRouter.getCharParty(socket);
        if (!party) {
            this.sendError(data, socket, "Failed to find party for engaging in party chat");
        }
        else {
            socket.broadcast.to(party.name).emit(this.CLIENT_GETS.PARTY_CHAT.name, {
                id: socket.character._id,
                msg: data.msg,
            });
        }
    }
}
exports.default = ChatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NoYXQvY2hhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUVsRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFbkYsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBR3pELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDOUMsQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2xELEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzNFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDbEQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDaEQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSTtnQkFDM0IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2FBQ2IsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNGLENBQUM7SUFFRCxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxpREFBaUQsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUN0RSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO2dCQUN4QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7YUFDYixDQUFDLENBQUM7UUFDSixDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBN0NELDZCQTZDQztBQUFBLENBQUMifQ==