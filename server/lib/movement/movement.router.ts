
import SocketioRouterBase from '../socketio/socketio.router.base';
import config from './movement.config';

export default class MovementRouter extends SocketioRouterBase {
	[config.SERVER_GETS.MOVEMENT.name](data, socket: GameSocket) {
		var position = socket.character.position;
		position.x = data.x;
		position.y = data.y;
		position.z = data.z;
		if (socket.test) {
			console.log("movement", data, socket.character.name);
		}
		socket.broadcast.to(socket.character.room).emit(config.CLIENT_GETS.MOVEMENT.name, {
			id: socket.character._id,
			x: data.x,
			y: data.y,
			z: data.z,
			angle: data.angle
		});
	}

	[config.SERVER_GETS.START_CLIMB.name](data, socket: GameSocket) {
		socket.character.position.climbing = true;
		socket.broadcast.to(socket.character.room).emit(config.CLIENT_GETS.START_CLIMB.name, {
			id: socket.character._id,
		});
	}

	[config.SERVER_GETS.STOP_CLIMB.name](data, socket: GameSocket) {
		socket.character.position.climbing = false;
		socket.broadcast.to(socket.character.room).emit(config.CLIENT_GETS.STOP_CLIMB.name, {
			id: socket.character._id,
		});
	}
};