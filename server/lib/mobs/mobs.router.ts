'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import MobsMiddleware from "./mobs.middleware";
import MobsController from "./mobs.controller";
import RoomsRouter from "../rooms/rooms.router";
let SERVER_GETS		   = require('../../../server/lib/mobs/mobs.config.json').SERVER_GETS;
let statsConfig = require('../../../server/lib/stats/stats.config.json');
let dropsConfig = require('../../../server/lib/drops/drops.config.json');

export default class MobsRouter extends SocketioRouterBase {
	protected middleware: MobsMiddleware;
	protected controller: MobsController;
	protected roomsRouter: RoomsRouter;
	
	init(files, app) {
		this.roomsRouter = files.routers.rooms;
		super.init(files, app);
	}
	
	protected initRoutes(app) {
		this.controller.setIo(this.io);

		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateMobs.bind(this.controller));
	}

	[SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		if (!this.controller.hasRoom(socket.character.room)) {
			// we must spawn new mobs
			let roomInfo = this.roomsRouter.getRoomInfo(socket.character.room);
			if (roomInfo) {
				this.controller.startSpawningMobs(roomInfo);
			} else {
				this.sendError({charRoom: socket.character.room}, socket, "No room info! cannot spawn any mobs.");
			}
		} else {
			this.controller.notifyAboutMobs(socket);
		}
	}

	[SERVER_GETS.MOB_TAKE_DMG.name](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id, socket)) {
			let load = socket.lastAttackLoad || 0;
			let dmg = this.controller.calculateDamage(socket, load);
			let mob = this.controller.hurtMob(data.mob_id, dmg, socket);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.MOB_TAKE_DMG.name, {
				id: socket.character._id,
				mob_id: mob.id,
				dmg,
				load,
				hp: mob.hp,
			});
			if (mob.hp === 0) {
				this.controller.despawnMob(mob, socket.character.room);
				let exp = mob.exp;
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp }, socket);
				this.emitter.emit(dropsConfig.SERVER_INNER.GENERATE_DROPS.name, {x: mob.x, y: mob.y}, socket, mob.drops);
			}
		} else {
			this.sendError(data, socket, "Mob doesn't exist!");
		}
	}

	[SERVER_GETS.MOB_MOVE.name](data, socket: GameSocket) {
		if (!this.controller.hasMob(data.mob_id, socket)) {
			this.sendError(data, socket, "Mob doesn't exist!");
		} else {
			this.controller.moveMob(data.mob_id, data.x, data.y, socket);
		}
	}

	[SERVER_GETS.TAKE_DMG.name](data, socket: GameSocket) {
		if (this.controller.hasMob(data.mob_id, socket)) {
			let dmg = this.controller.getHurtCharDmg(data.mob_id, socket);
			this.emitter.emit(statsConfig.SERVER_INNER.TAKE_DMG.name, { dmg }, socket);
		} else {
			this.sendError(data, socket, "Mob doesn't exist!");
		}
	}
};
