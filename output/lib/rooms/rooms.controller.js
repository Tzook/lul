'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
const _ = require("underscore");
let config = require('../../../server/lib/rooms/rooms.config.json');
class RoomsController extends master_controller_1.default {
    constructor() {
        super();
        this.roomBitchKeys = new Map();
        this.roomBitches = new Map();
    }
    setIo(io) {
        this.io = io;
    }
    socketJoinRoom(socket) {
        let room = socket.character.room;
        socket.join(room);
        let roomObject = socket.adapter.rooms[room];
        if (roomObject.length === 1) {
            this.setNewBitch(socket, room);
        }
        if (roomObject.length === 2) {
            this.askForBitch(room);
        }
    }
    socketLeaveRoom(socket, room) {
        this.removeBitch(socket, room);
        let roomObject = socket.adapter.rooms[room];
        if (roomObject && roomObject.length) {
            let socketId = Object.keys(roomObject.sockets)[0];
            let newBitch = socket.map.get(socketId);
            this.setNewBitch(newBitch, room);
        }
    }
    removeBitch(socket, room) {
        console.log("stopping bitch: %s, room: %s", socket.character.name, room);
        socket.bitch = false;
        this.roomBitches.delete(room);
        socket.emit(config.CLIENT_GETS.BITCH_CHOOSE.name, {
            is_bitch: false
        });
    }
    askForBitch(room) {
        setTimeout(() => {
            let sockets = this.io.sockets.adapter.rooms[room];
            if (sockets && sockets.length > 1) {
                let key = _.uniqueId();
                this.roomBitchKeys.set(room, key);
                console.log("asking bitch please. key %s, room:", key, room);
                this.io.to(room).emit(config.CLIENT_GETS.BITCH_PLEASE.name, {
                    key
                });
                this.askForBitch(room);
            }
        }, config.BITCH_INTERVAL);
    }
    newBitchRequest(socket, key) {
        let room = socket.character.room;
        let roomKey = this.roomBitchKeys.get(room);
        if (key == roomKey) {
            let oldBitch = this.roomBitches.get(room);
            if (oldBitch === socket) {
                console.log("Same bitch in the room.");
            }
            else {
                this.removeBitch(oldBitch, room);
                this.setNewBitch(socket, room);
            }
        }
    }
    setNewBitch(socket, room) {
        console.log("new bitch: %s, room: %s", socket.character.name, room);
        socket.bitch = true;
        this.roomBitches.set(room, socket);
        socket.emit(config.CLIENT_GETS.BITCH_CHOOSE.name, {
            is_bitch: true
        });
    }
    pickRandomPortal(roomInfo) {
        return _.sample(roomInfo.portals);
    }
    generateRoom(req, res, next) {
        this.services.generateRoom(req.body.scene)
            .then(d => {
            this.sendData(res, this.LOGS.GENERATE_ROOM, d);
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateRoom", file: "rooms.controller.js" });
        });
    }
    warmRoomsInfo() {
        this.services.getRooms()
            .catch(e => {
            console.error("Had an error getting rooms from the db!");
            throw e;
        });
    }
}
exports.default = RoomsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELGdDQUFnQztBQUVoQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxxQkFBcUMsU0FBUSwyQkFBZ0I7SUFNNUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUpELGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDL0MsZ0JBQVcsR0FBNEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUl6RCxDQUFDO0lBRU0sS0FBSyxDQUFDLEVBQUU7UUFDZCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxjQUFjLENBQUMsTUFBa0I7UUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUM7SUFDRixDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUN0RCxJQUFJLENB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