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
        socket.bitch = false;
        this.roomBitches.delete(room);
        console.log("stopping bitch: %s, room: %s", socket.character.name, room);
        let roomObject = socket.adapter.rooms[room];
        if (roomObject && roomObject.length) {
            let socketId = Object.keys(roomObject.sockets)[0];
            let newBitch = socket.map.get(socketId);
            this.setNewBitch(newBitch, room);
        }
    }
    askForBitch(room) {
        setTimeout(() => {
            let sockets = this.io.sockets.adapter.rooms[room];
            if (sockets && sockets.length > 1) {
                let key = _.uniqueId();
                this.roomBitchKeys.set(room, key);
                console.log("asking bitch please. key %s, room:", key, room);
                this.io.to(room).emit(config.CLIENT_GETS.BITCH_PLEASE, {
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
            this.roomBitchKeys.delete(room);
            let oldBitch = this.roomBitches.get(room);
            if (oldBitch === socket) {
                console.log("Same bitch in the room.");
            }
            else {
                oldBitch.bitch = false;
                oldBitch.emit(config.CLIENT_GETS.BITCH_CHOOSE, {
                    is_bitch: false
                });
                this.setNewBitch(socket, room);
            }
        }
    }
    setNewBitch(socket, room) {
        console.log("new bitch: %s, room: %s", socket.character.name, room);
        socket.bitch = true;
        this.roomBitches.set(room, socket);
        socket.emit(config.CLIENT_GETS.BITCH_CHOOSE, {
            is_bitch: true
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELGdDQUFnQztBQUVoQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxxQkFBcUMsU0FBUSwyQkFBZ0I7SUFNNUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUpELGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDL0MsZ0JBQVcsR0FBNEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUl6RCxDQUFDO0lBRU0sS0FBSyxDQUFDLEVBQUU7UUFDZCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxjQUFjLENBQUMsTUFBa0I7UUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUM7SUFDRixDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUN0RCxNQUFNLENB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