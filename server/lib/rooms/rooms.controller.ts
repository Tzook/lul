'use strict';
import MasterController from '../master/master.controller';
import * as _ from 'underscore';
import RoomsServices from "./rooms.services";
let config = require('../../../server/lib/rooms/rooms.config.json');

export default class RoomsController extends MasterController {
	protected services: RoomsServices;
	private io: SocketIO.Namespace;
	private roomBitchKeys: Map<string, string> = new Map();
	private roomBitches: Map<string, GameSocket> = new Map();

	constructor() {
		super();
	}

	public setIo(io) {
		this.io = io;
	}

	public socketJoinRoom(socket: GameSocket) {
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

	public socketLeaveRoom(socket: GameSocket, room: string) {
		this.removeBitch(socket, room);

		let roomObject = socket.adapter.rooms[room];
		if (roomObject && roomObject.length) {
			let socketId = Object.keys(roomObject.sockets)[0];
			let newBitch = socket.map.get(socketId);
			this.setNewBitch(newBitch, room);
		}
	}

	private removeBitch(socket: GameSocket, room: string) {
		console.log("stopping bitch: %s, room: %s", socket.character.name, room);
		socket.bitch = false;
		this.roomBitches.delete(room);
		socket.emit(config.CLIENT_GETS.BITCH_CHOOSE, {
			is_bitch: false
		});
	}

	protected askForBitch(room: string) {
		setTimeout(() => {
			let sockets = (<any>this.io.sockets).adapter.rooms[room];
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

	public newBitchRequest(socket: GameSocket, key: string) {
		let room = socket.character.room;
		let roomKey = this.roomBitchKeys.get(room);
		if (key == roomKey) {
			let oldBitch = this.roomBitches.get(room);
			if (oldBitch === socket) {
				console.log("Same bitch in the room.");
			} else {
				this.removeBitch(oldBitch, room);
				this.setNewBitch(socket, room);
			}
		}
	}

	protected setNewBitch(socket: GameSocket, room) {
		console.log("new bitch: %s, room: %s", socket.character.name, room);
		socket.bitch = true;
		this.roomBitches.set(room, socket);
		socket.emit(config.CLIENT_GETS.BITCH_CHOOSE, {
			is_bitch: true
		});
	}

	public pickRandomPortal(roomInfo: ROOM_MODEL): PORTAL_MODEL {
		return <any>_.sample(roomInfo.portals);
	}

    // HTTP functions
	// =================
	public generateRoom(req, res, next) {
        this.services.generateRoom(req.body.scene)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_ROOM, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateRoom", file: "rooms.controller.js"});
			});
    }

	public warmRoomsInfo(): void {
		this.services.getRooms()
			.catch(e => {
				console.error("Had an error getting rooms from the db!");
				throw e;
			});
	}
};