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
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateMobs.bind(this.controller));
	}
	
	[SERVER_GETS.MOB_TAKE_DMG](data, socket: GameSocket) {
		// TODO
	}

	[SERVER_GETS.MOB_MOVE](data, socket: GameSocket) {
		// TODO
	}
};
