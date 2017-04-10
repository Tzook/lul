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

	protected askForBitch(room: string) {
		setTimeout(() => {
            if ((<any>this.io.sockets).adapter.rooms[room].length > 1) {
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
			this.roomBitchKeys.delete(room);
			let oldBitch = this.roomBitches.get(room);
			if (oldBitch === socket) {
				console.log("Same bitch in the room.");
			} else {
				oldBitch.bitch = false;
				oldBitch.emit(config.CLIENT_GETS.BITCH_CHOOSE, {
					is_bitch: false
				});
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