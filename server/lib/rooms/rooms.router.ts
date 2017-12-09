
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import RoomsController from './rooms.controller';
import RoomsMiddleware from './rooms.middleware';
import RoomsServices from './rooms.services';
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
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateRoom.bind(this.controller));
	}

	public getRoomInfo(room: string): ROOM_MODEL|undefined {
		return this.services.getRoomInfo(room);
	}

    public getPublicCharInfo(char: Char) {
        return this.middleware.getPublicCharInfo(char);
	}
	
	public isEmpty(room): boolean {
		return !this.io.sockets.adapter.rooms[room];
	}

	[config.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.JOIN_ROOM.name, {
			character: this.middleware.getPublicCharInfo(socket.character)
		});
		let roomObject = socket.adapter.rooms[socket.character.room];
		if (roomObject) {
			_.each(roomObject.sockets, (value, socketId: string) => {
				socket.emit(this.CLIENT_GETS.JOIN_ROOM.name, {
					character: this.middleware.getPublicCharInfo(socket.map.get(socketId).character)
				});
			});
		}

		this.controller.socketJoinRoom(socket);
	}

	[config.SERVER_GETS.ENTER_PORTAL.name](data, socket: GameSocket) {
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
                this.emitter.emit(config.SERVER_INNER.MOVE_ROOM.name, {
                    room: portal.targetRoom, 
                    targetPortal
                }, socket);
			}
		}
	}

	[config.SERVER_INNER.MOVE_TO_TOWN.name] (data, socket: GameSocket) {
		let roomInfo = this.services.getRoomInfo(socket.character.room);
		if (!roomInfo) {
			this.sendError(data, socket, "No room info available for " + socket.character.room);
		} else {
			let targetRoomInfo = this.services.getRoomInfo(roomInfo.town);
			if (!targetRoomInfo) {
				this.sendError(data, socket, "No target room info available for " + roomInfo.town);
			} else {
				let targetPortal = this.controller.pickRandomPortal(targetRoomInfo);
                this.emitter.emit(config.SERVER_INNER.MOVE_ROOM.name, {
                    room: targetRoomInfo.name, 
                    targetPortal
                }, socket);
			}
		}
	}

	[config.SERVER_INNER.MOVE_ROOM.name](data: {room: string, targetPortal: PORTAL_MODEL}, socket: GameSocket) {
        let {room, targetPortal} = data;
		socket.leave(socket.character.room);

        this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);
		
		socket.character.room = room;
		socket.character.position.x = targetPortal.x;
		socket.character.position.y = targetPortal.y;
		socket.emit(this.CLIENT_GETS.MOVE_ROOM.name, {
			room,
			character: socket.character
		});
	}

	[config.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		this.emitter.emit(config.SERVER_INNER.LEFT_ROOM.name, {}, socket);
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
        socket.emit(this.CLIENT_GETS.MOVE_ROOM.name, {
			room: socket.character.room,
			character: socket.character,
		});
    }
};