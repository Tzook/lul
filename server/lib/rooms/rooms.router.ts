'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import RoomsController from './rooms.controller';
import RoomsMiddleware from "./rooms.middleware";
import RoomsServices from "./rooms.services";
let SERVER_GETS = require('../../../server/lib/rooms/rooms.config.json').SERVER_GETS;

export default class RoomsRouter extends SocketioRouterBase {
	protected middleware: RoomsMiddleware;
	protected controller: RoomsController;
	protected services: RoomsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	protected initRoutes(app) {
		this.controller.setIo(this.io);
		
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateRoom.bind(this.controller));
	}

	public getRoomInfo(room: string): ROOM_MODEL|undefined {
		return this.services.getRoomInfo(room);
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		// const also used in items
		console.log('character %s entered room', socket.character.name);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.character});
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM, {character: socket.map.get(socketId).character});
			});
		}

		this.controller.socketJoinRoom(socket);
	}

	[SERVER_GETS.ENTER_PORTAL](data, socket: GameSocket) {
		if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		console.log('user entered portal', socket.character.name, data.portal);
		let roomInfo = this.services.getRoomInfo(socket.character.room);
		if (!roomInfo) {
			this.sendError(data, socket, "No room info available!");
		} else if (!roomInfo.portals[data.portal]) {
			this.sendError(data, socket, "No portal with such key in room: " + socket.character.room);
		} else {
			let portal = roomInfo.portals[data.portal];
			let targetRoomInfo = this.services.getRoomInfo(portal.targetRoom);
			if (!targetRoomInfo) {
				this.sendError(data, socket, "No target room info available!");
			} else if (!targetRoomInfo.portals[portal.targetPortal]) {
				this.sendError(data, socket, "No target portal in room!");
			} else {
				let targetPortal = targetRoomInfo.portals[portal.targetPortal];

				socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, {
					id: socket.character._id
				});
				let oldRoom = socket.character.room;
				socket.leave(oldRoom);
				socket.character.room = portal.targetRoom;
				socket.character.position.x = targetPortal.x;
				socket.character.position.y = targetPortal.y;
				socket.emit(this.CLIENT_GETS.MOVE_ROOM, {room: portal.targetRoom, x: targetPortal.x, y: targetPortal.y});

				this.controller.socketLeaveRoom(socket, oldRoom);
			}
		}
	}

	[SERVER_GETS.DISCONNECT](data, socket: GameSocket) {
		console.log('disconnect from room');
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEAVE_ROOM, {
			 id: socket.character._id
		});

		this.controller.socketLeaveRoom(socket, socket.character.room);
	}

	[SERVER_GETS.BITCH_PLEASE](data, socket: GameSocket) {
		let key = data.key;
		console.log('bitch please received from %s with key %s', socket.character.name, key);
		this.controller.newBitchRequest(socket, key);
	}
};