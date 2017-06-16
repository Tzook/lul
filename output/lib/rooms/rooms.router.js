'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
const _ = require("underscore");
let config = require('../../../server/lib/rooms/rooms.config.json');
class RoomsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.services = files.services;
        super.init(files, app);
    }
    initRoutes(app) {
        this.controller.setIo(this.io);
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateRoom.bind(this.controller));
    }
    getRoomInfo(room) {
        return this.services.getRoomInfo(room);
    }
    [config.SERVER_GETS.ENTERED_ROOM.name](data, socket) {
        console.log('character %s entered room', socket.character.name);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.JOIN_ROOM.name, {
            character: this.middleware.getPublicCharInfo(socket.character)
        });
        let roomObject = socket.adapter.rooms[socket.character.room];
        if (roomObject) {
            _.each(roomObject.sockets, (value, socketId) => {
                socket.emit(this.CLIENT_GETS.JOIN_ROOM.name, {
                    character: this.middleware.getPublicCharInfo(socket.map.get(socketId).character)
                });
            });
        }
        this.controller.socketJoinRoom(socket);
    }
    [config.SERVER_GETS.ENTER_PORTAL.name](data, socket) {
        console.log('user entered portal', socket.character.name, data.portal);
        let roomInfo = this.services.getRoomInfo(socket.character.room);
        if (!roomInfo) {
            this.sendError(data, socket, "No room info available!");
        }
        else if (!roomInfo.portals[data.portal]) {
            this.sendError(data, socket, "No portal with such key in room: " + socket.character.room);
        }
        else {
            let portal = roomInfo.portals[data.portal];
            let targetRoomInfo = this.services.getRoomInfo(portal.targetRoom);
            if (!targetRoomInfo) {
                this.sendError(data, socket, "No target room info available!");
            }
            else if (!targetRoomInfo.portals[portal.targetPortal]) {
                this.sendError(data, socket, "No target portal in room!");
            }
            else {
                let targetPortal = targetRoomInfo.portals[portal.targetPortal];
                this.moveRoom(socket, portal.targetRoom, targetPortal);
            }
        }
    }
    [config.SERVER_INNER.MOVE_TO_TOWN.name](data, socket) {
        let roomInfo = this.services.getRoomInfo(socket.character.room);
        if (!roomInfo) {
            this.sendError(data, socket, "No room info available for " + socket.character.room);
        }
        else {
            let targetRoomInfo = this.services.getRoomInfo(roomInfo.town);
            if (!targetRoomInfo) {
                this.sendError(data, socket, "No target room info available for " + roomInfo.town);
            }
            else {
                let targetPortal = this.controller.pickRandomPortal(targetRoomInfo);
                this.moveRoom(socket, targetRoomInfo.name, targetPortal);
            }
        }
    }
    moveRoom(socket, room, targetPortal) {
        socket.leave(socket.character.room);
        this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);
        socket.character.room = room;
        socket.character.position.x = targetPortal.x;
        socket.character.position.y = targetPortal.y;
        console.log("moving character %s to room %s", socket.character.name, room);
        socket.emit(this.CLIENT_GETS.MOVE_ROOM.name, {
            room,
            character: socket.character
        });
    }
    [config.SERVER_GETS.DISCONNECT.name](data, socket) {
        console.log('disconnect from room');
        this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);
    }
    [config.SERVER_INNER.LEFT_ROOM.name](data, socket) {
        this.controller.socketLeaveRoom(socket, socket.character.room);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEFT_ROOM.name, {
            id: socket.character._id
        });
    }
    [config.SERVER_GETS.BITCH_PLEASE.name](data, socket) {
        let key = data.key;
        console.log('bitch please received from %s with key %s', socket.character.name, key);
        this.controller.newBitchRequest(socket, key);
    }
    onConnected(socket) {
        socket.emit(this.CLIENT_GETS.MOVE_ROOM.name, {
            room: socket.character.room,
            character: socket.character,
        });
    }
}
exports.default = RoomsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9yb29tcy9yb29tcy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUNsRSxnQ0FBZ0M7QUFJaEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFcEUsaUJBQWlDLFNBQVEsOEJBQWtCO0lBSzFELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRVMsVUFBVSxDQUFDLEdBQUc7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSxXQUFXLENBQUMsSUFBWTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBRTlELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENB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