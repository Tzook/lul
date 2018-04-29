
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import RoomsController from './rooms.controller';
import RoomsMiddleware from './rooms.middleware';
import RoomsServices, { getRoomInstance, isInInstance, getRoomName } from './rooms.services';
import config from './rooms.config';

export default class RoomsRouter extends SocketioRouterBase {
	protected middleware: RoomsMiddleware;
	protected controller: RoomsController;
	protected services: RoomsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.isBoss.bind(this.middleware),
			this.controller.generateRoom.bind(this.controller));
	}

	public getRoomInfo(room: string): ROOM_MODEL|undefined {
		return this.services.getRoomInfo(room);
	}
	
	public isEmpty(room): boolean {
		return !this.io.sockets.adapter.rooms[room];
	}

	[config.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.JOIN_ROOM.name, {
			character: this.middleware.getPublicCharInfo(socket)
		});
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM.name, {
					character: this.middleware.getPublicCharInfo(socket.map.get(socketId))
				});
			});
		}

		this.controller.socketJoinRoom(socket);
	}

	[config.SERVER_GETS.ENTER_PORTAL.name](data, socket: GameSocket) {
		let roomInfo = this.services.getRoomInfo(getRoomName(socket));
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
				let room = portal.targetRoom;
				if (data.instance) {
					room = getRoomInstance(room);
				}
                this.emitter.emit(config.SERVER_INNER.MOVE_ROOM.name, {
                    room, 
					targetPortal,
                }, socket);
			}
		}
	}

	[config.SERVER_GETS.STUCK.name] (data, socket: GameSocket) {
        this.emitter.emit(config.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
	}

	[config.SERVER_INNER.MOVE_TO_TOWN.name] (data, socket: GameSocket) {
		let roomInfo = this.services.getRoomInfo(getRoomName(socket));
		if (!roomInfo) {
			this.sendError(data, socket, "No room info available for " + socket.character.room);
		} else {
			let targetRoomInfo = this.services.getRoomInfo(roomInfo.town);
			if (!targetRoomInfo) {
				this.sendError(data, socket, "No target room info available for " + roomInfo.town);
			} else {
                this.emitter.emit(config.SERVER_INNER.MOVE_ROOM.name, {
                    room: targetRoomInfo.name, 
                }, socket);
			}
		}
	}

	[config.SERVER_INNER.MOVE_ROOM.name](data: {room: string, targetPortal?: PORTAL_MODEL}, socket: GameSocket) {
		let {room, targetPortal} = data;
		targetPortal = targetPortal || this.controller.pickRandomPortal(this.services.getRoomInfo(room));
		socket.leave(socket.character.room);

        this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);

		socket.character.room = room;
		socket.character.position.x = targetPortal.x;
		socket.character.position.y = targetPortal.y;
		this.notifyAboutRoom(socket);
	}

	[config.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);
		if (isInInstance(socket)) {
			// make sure you don't login in a room instance
			this.emitter.emit(config.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
		}
	}

	[config.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		this.controller.socketLeaveRoom(socket, socket.character.room);
	
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LEFT_ROOM.name, {
			 id: socket.character._id
		});
	}

	[config.SERVER_GETS.BITCH_PLEASE.name](data, socket: GameSocket) {
		let key = data.key;
		this.controller.newBitchRequest(socket, key);
	}

    public onConnected(socket: GameSocket) {
		process.nextTick(() => this.notifyAboutRoom(socket));
	}
	
	protected notifyAboutRoom(socket: GameSocket) {
		socket.emit(this.CLIENT_GETS.MOVE_ROOM.name, {
			room: getRoomName(socket),
			character: this.middleware.getPrivateCharInfo(socket),
		});
	}
};