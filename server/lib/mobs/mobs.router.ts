'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import MobsMiddleware from "./mobs.middleware";
import MobsController from "./mobs.controller";
import RoomsRouter from "../rooms/rooms.router";
let SERVER_GETS		   = require('../../../server/lib/mobs/mobs.config.json').SERVER_GETS;

export default class MobsRouter extends SocketioRouterBase {
	protected middleware: MobsMiddleware;
	protected controller: MobsController;
	protected roomsRouter: RoomsRouter;
	
	init(files, app) {
		this.roomsRouter = files.routers.rooms;
		super.init(files, app);
	}
	
	initRoutes(app) {
		this.controller.setIo(this.io);

		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateMobs.bind(this.controller));
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		if (!this.controller.hasRoom(socket.character.room)) {
			// we must spawn new mobs
			let roomInfo = this.roomsRouter.getRoomInfo(socket.character.room);
			if (!roomInfo) {
				console.error("No room info! cannot spawn any mobs.");
				return;
			}
			this.controller.startSpawningMobs(roomInfo);
		} else {
			this.controller.notifyAboutMobs(socket);
		}
	}

	[SERVER_GETS.MOB_TAKE_DMG](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id)) {

		} else {
			console.error("Got 'mob taking damage' but mob doesn't exist!", data.mob_id);
		}
	}

	[SERVER_GETS.MOB_MOVE](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id)) {
			this.controller.moveMob(data.mob_id, data.x, data.y, socket);
		} else {
			console.error("Got a mob movement but mob doesn't exist!", data.mob_id);
		}
	}
};
