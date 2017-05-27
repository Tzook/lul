'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsMiddleware from "./items.middleware";
import ItemsController from './items.controller';
import ItemsServices from './items.services';
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let config = require('../../../server/lib/items/items.config.json');

export default class ItemsRouter extends SocketioRouterBase {
	protected middleware: ItemsMiddleware;
	protected controller: ItemsController;
	protected services: ItemsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	protected initRoutes(app) {
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

	public getItemsCounts(socket: GameSocket) {
		let map: ITEMS_COUNTS = new Map();
		for (let item of socket.character.items) {
			let currentCount = map.get(item.key) || 0;
			map.set(item.key, currentCount + (item.stack || 1));
		}
		return map;
	}

	public getItemsSlots(socket: GameSocket, items: ITEM_INSTANCE[]): false|{[key: string]: number[]} {
		return this.middleware.getItemsSlots(socket, items);
	}

	[config.SERVER_GETS.ITEM_PICK.name](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item: ITEM_INSTANCE): any => {
			let itemInfo = this.getItemInfo(item.key);
            if (itemInfo.cap > 1) {
                return;
            }
            let slot = this.middleware.getFirstAvailableSlot(socket);
			if (!(slot >= 0)) { 
				this.sendError(data, socket, "No available slots to pick item");
			} else {
				this[config.SERVER_INNER.ITEM_ADD.name]({slots: [slot], item}, socket);
				return true;
			}	
		});
	}

	[config.SERVER_INNER.ITEM_ADD.name](data: {slots: number[], item: ITEM_INSTANCE}, socket: GameSocket) {
		let {slots, item} = data;
		let itemInfo = this.getItemInfo(item.key);
		if (!this.middleware.isGold(item) && !this.middleware.isMisc(itemInfo)) {
			socket.character.items.set(slots[0], item);
			socket.emit(this.CLIENT_GETS.ITEM_ADD.name, { slot: slots[0], item });
		}
	}

	[config.SERVER_GETS.ITEM_DROP.name](data, socket: GameSocket) {
		let slot = data.slot;
		if (!this.middleware.hasItem(socket, slot)) {
			this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		} else {
			let item = socket.character.items[slot];
			console.log("dropping item", item);
			this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
			socket.character.items.set(slot, {});
			socket.emit(this.CLIENT_GETS.ITEM_DELETE.name, { slot });
		}
	}

	[config.SERVER_GETS.ITEM_MOVE.name](data, socket: GameSocket) {
		if (!this.middleware.isValidItemSlot(data.from)
		 	|| !this.middleware.isValidItemSlot(data.to)) {
			this.sendError(data, socket, "Invalid slots!");
		} else {
			let itemFrom = socket.character.items[data.from];
			let itemTo = socket.character.items[data.to];

			console.log('moving item from ' + data.from + " to " + data.to, itemFrom, itemTo);
			socket.character.items.set(data.to, itemFrom);
			socket.character.items.set(data.from, itemTo);
			socket.emit(this.CLIENT_GETS.ITEM_MOVE.name, {
				id: socket.character._id,
				from: data.from,
				to: data.to
			});
		}
	}

	[config.SERVER_INNER.ITEMS_ADD.name](data: {items: ITEM_INSTANCE[], slots: {[key: string]: number[]}}, socket: GameSocket) {
		let {items, slots} = data;
		items.forEach(item => {
			let itemSlots = slots[item.key];
			this.emitter.emit(config.SERVER_INNER.ITEM_ADD.name, { slots: itemSlots, item }, socket);
		});
	}
};
