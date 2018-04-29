import SocketioRouterBase from '../socketio/socketio.router.base';
import stateConfig from './state.config';
import StateServices, { updateCharVar } from './state.services';

export default class StateRouter extends SocketioRouterBase {
	protected services: StateServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	[stateConfig.SERVER_GETS.UPDATE_ROOM_STATE.name](data, socket: GameSocket) {
		let {key, value} = data;
		
		let updatedState = this.services.updateRoomState(socket.character.room, key, value);
		if (!updatedState) {
			return this.sendError(data, socket, "Room state is too big!");
		}
		socket.broadcast.to(socket.character.room).emit(stateConfig.CLIENT_GETS.ROOM_STATE.name, {
			key,
			value,
		});
	}
	
	[stateConfig.SERVER_GETS.UPDATE_CHAR_VAR.name](data, socket: GameSocket) {
		let {key, value} = data;
		if (!key) {
			return this.sendError(data, socket, "Must provide a key");
		}
		let updatedVars = updateCharVar(socket, key, value);
		if (!updatedVars) {
			return this.sendError(data, socket, "Not allowed to update var");
		}
	}
	
	[stateConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		let roomState = this.services.getRoomState(socket.character.room);
		for (let [key, value] of roomState) {
			socket.emit(stateConfig.CLIENT_GETS.ROOM_STATE.name, {
				key, 
				value,
			});
		}
	}
	
	[stateConfig.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		let peopleLeftInRoom = socket.adapter.rooms[socket.character.room];
		if (!peopleLeftInRoom) {
			this.services.clearRoomState(socket.character.room);
		}
	}
};
