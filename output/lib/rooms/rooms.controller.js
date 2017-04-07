'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
const _ = require("underscore");
let config = require('../../../server/lib/rooms/rooms.config.json');
class RoomsController extends master_controller_1.default {
    constructor() {
        super();
        this.roomKeys = new Map();
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
            if (this.io.sockets.adapter.rooms[room].length > 1) {
                let key = _.uniqueId();
                this.roomKeys.set(room, key);
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
        let roomKey = this.roomKeys.get(room);
        if (key == roomKey) {
            this.roomKeys.delete(room);
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
}
exports.default = RoomsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELGdDQUFnQztBQUNoQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxxQkFBcUMsU0FBUSwyQkFBZ0I7SUFLNUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUpELGFBQVEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMxQyxnQkFBVyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBSXpELENBQUM7SUFFTSxLQUFLLENBQUMsRUFBRTtRQUNkLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGNBQWMsQ0FBQyxNQUFrQjtRQUN2QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNGLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBa0IsRUFBRSxJQUFZO1FBQ3RELE1BQU0sQ0FB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