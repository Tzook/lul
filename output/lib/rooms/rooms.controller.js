'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
const _ = require("underscore");
let config = require('../../../server/lib/rooms/rooms.config.json');
class RoomsController extends master_controller_1.default {
    constructor() {
        super(...arguments);
        this.roomBitchKeys = new Map();
        this.roomBitches = new Map();
        this.roomBitchTimeouts = new Map();
    }
    socketJoinRoom(socket) {
        let room = socket.character.room;
        socket.join(room);
        let roomObject = socket.adapter.rooms[room];
        if (roomObject.length === 1) {
            this.setNewBitch(socket, room);
        }
        else {
            this.askForBitch(room);
        }
    }
    socketLeaveRoom(socket, room) {
        if (socket.bitch) {
            this.removeBitch(socket, room);
            let roomObject = socket.adapter.rooms[room];
            if (roomObject && roomObject.length) {
                let socketId = this.pickRandomSocket(Object.keys(roomObject.sockets));
                let newBitch = socket.map.get(socketId);
                this.setNewBitch(newBitch, room);
                if (roomObject.length > 1) {
                    this.askForBitch(room);
                }
            }
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
        clearTimeout(this.roomBitchTimeouts.get(room));
        let sockets = this.io.sockets.adapter.rooms[room];
        if (sockets && sockets.length > 1) {
            let key = _.uniqueId();
            this.roomBitchKeys.set(room, key);
            console.log("asking bitch please. key %s, room:", key, room);
            this.io.to(room).emit(config.CLIENT_GETS.BITCH_PLEASE.name, {
                key
            });
            let timeout = setTimeout(() => {
                this.askForBitch(room);
            }, config.BITCH_INTERVAL);
            this.roomBitchTimeouts.set(room, timeout);
        }
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
    pickRandomSocket(sockets) {
        return _.sample(sockets);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELGdDQUFnQztBQUVoQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxxQkFBcUMsU0FBUSwyQkFBZ0I7SUFBN0Q7O1FBRVMsa0JBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMvQyxnQkFBVyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2pELHNCQUFpQixHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBMEc1RCxDQUFDO0lBeEdPLGNBQWMsQ0FBQyxNQUFrQjtRQUN2QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUM7SUFDRixDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUN0RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBR3JDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVPLFdBQVcsQ0FBQyxNQUFrQixFQUFFLElBQVk7UUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtZQUNqRCxRQUFRLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFUyxXQUFXLENBQUMsSUFBWTtRQUNqQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxHQUFTLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7Z0JBQzNELEdBQUc7YUFDSCxDQUFDLENBQUM7WUFDSCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0YsQ0FBQztJQUVNLGVBQWUsQ0FBQyxNQUFrQixFQUFFLEdBQVc7UUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVTLFdBQVcsQ0FBQyxNQUFrQixFQUFFLElBQUk7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDakQsUUFBUSxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsUUFBb0I7UUFDM0MsTUFBTSxDQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFpQjtRQUN4QyxNQUFNLENBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBSU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUM5QyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBQyxDQUFDLENBQUM7UUFDNUcsQ0FBQyxDQUFDLENBQUM7SUFDRixDQUFDO0lBRUcsYUFBYTtRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTthQUN0QixLQUFLLENBQUMsQ0FBQztZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNEO0FBOUdELGtDQThHQztBQUFBLENBQUMifQ==