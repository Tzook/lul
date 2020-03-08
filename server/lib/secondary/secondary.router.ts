import SocketioRouterBase from '../socketio/socketio.router.base';
import secondaryConfig from './secondary.config';
import { getRoomSecondaryModes, deleteSecondaryMode, setSecondaryMode, getSecondaryMode } from './secondary.services';
import { createAttackInfo } from '../combat/combat.services';
import combatConfig from '../combat/combat.config';

export default class SecondaryRouter extends SocketioRouterBase {
	[secondaryConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		for (let roomSocket of getRoomSecondaryModes(socket)) {
			socket.emit(secondaryConfig.CLIENT_GETS.SECONDARY_MODE_START.name, {id: roomSocket.character._id});
		}
	}
	
	[secondaryConfig.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		deleteSecondaryMode(socket);
	}
	
	[secondaryConfig.SERVER_GETS.SECONDARY_MODE_START.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(secondaryConfig.CLIENT_GETS.SECONDARY_MODE_START.name, {id: socket.character._id});
		setSecondaryMode(socket);
	}
	
	[secondaryConfig.SERVER_GETS.SECONDARY_MODE_HIT.name](data, socket: GameSocket) {
		const {target_ids} = data;
		if (!getSecondaryMode(socket)) {
			return this.sendError(data, socket, "Must be in secondary mode to hit");			
		}
		const attackInfo = createAttackInfo(socket, 0);
		this.emitter.emit(combatConfig.SERVER_INNER.ACTIVATE_ABILITY.name, {target_ids, attackInfo}, socket);
	}
	
	[secondaryConfig.SERVER_GETS.SECONDARY_MODE_END.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(secondaryConfig.CLIENT_GETS.SECONDARY_MODE_END.name, {id: socket.character._id});
		deleteSecondaryMode(socket);		
	}
}