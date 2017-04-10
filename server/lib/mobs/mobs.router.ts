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
			// damage is hardcoded 10 for now. TODO: calculate the damage
			let dmg = 10;
			let mob = this.controller.hurtMob(data.mob_id, dmg);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.MOB_TAKE_DMG, {
				mob_id: mob.id,
				dmg,
				hp: mob.hp,
			});
			if (mob.hp === 0) {
				this.controller.despawnMob(mob, socket.character.room);
				// TODO gain exp
				// TODO mob drops
			}
		} else {
			console.error("Got 'mob taking damage' but mob doesn't exist!", data.mob_id);
		}
	}

	[SERVER_GETS.MOB_MOVE](data, socket: GameSocket) {
		if (!socket.bitch) {
			console.error("Trying to move mob but character %s is not a bitch", socket.character.name);
		} else if (!this.controller.hasMob(data.mob_id)) {
			console.error("Got a mob movement but mob doesn't exist!", data.mob_id);
		} else {
			this.controller.moveMob(data.mob_id, data.x, data.y, socket);
		}
	}

	[SERVER_GETS.TAKE_DMG](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id)) {
			this.controller.hurtChar(data.mob_id, socket);
		} else {
			console.error("Got 'actor taking damage' but mob doesn't exist!", data.mob_id);
		}
	}
};
