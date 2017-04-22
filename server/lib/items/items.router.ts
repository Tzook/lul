'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsMiddleware from "./items.middleware";
import ItemsController from './items.controller';
import ItemsServices from './items.services';
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = require('../../../server/lib/items/items.config.json').SERVER_GETS;

export default class ItemsRouter extends SocketioRouterBase {
	protected middleware: ItemsMiddleware;
	protected controller: ItemsController;
	protected services: ItemsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	initRoutes(app) {
		this.controller.setIo(this.io);

		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateItems.bind(this.controller));
	}

	public getItemInfo(key: string): ITEM_MODEL|undefined {
		return this.services.getItemInfo(key);
	}

	public getItemInstance(key: string): ITEM_INSTANCE|undefined {
		return this.services.getItemInstance(key);
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		let slot = this.middleware.getFirstAvailableSlot(socket);
		if (!(slot >= 0)) { 
			this.sendError(data, socket, "No available slots to pick item");
		} else {
			this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK, data, socket, (item: ITEM_INSTANCE) => {
				socket.character.items.set(slot, item);
			}, {slot});
		}
	}

	[SERVER_GETS.ITEM_DROP](data, socket: GameSocket) {
		let slot = data.slot;
		if (this.middleware.hasItem(socket, slot)) {
			let item = socket.character.items[slot];
			console.log("dropping item", item);
			this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP, {}, socket, [item]);
			socket.character.items.set(slot, {});
			socket.emit(this.CLIENT_GETS.ITEM_DELETE, { slot });
		} else {
			this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		}
	}

	[SERVER_GETS.ITEM_MOVE](data, socket: GameSocket) {
		if (this.middleware.isValidItemSlot(data.from)
		 	&& this.middleware.isValidItemSlot(data.to)) {
			let itemFrom = socket.character.items[data.from];
			let itemTo = socket.character.items[data.to];

			console.log('moving item from ' + data.from + " to " + data.to, itemFrom, itemTo);
			socket.character.items.set(data.to, itemFrom);
			socket.character.items.set(data.from, itemTo);
			socket.emit(this.CLIENT_GETS.ITEM_MOVED, {
				id: socket.character._id,
				from: data.from,
				to: data.to
			});
		} else {
			this.sendError(data, socket, "Invalid slots!");
		}
	}
};
