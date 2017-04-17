'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsMiddleware from "./items.middleware";
import * as _ from 'underscore';
let config = require('../../../server/lib/items/items.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class ItemsRouter extends SocketioRouterBase {
	private itemsMap: Map<string, {x, y, item_id, item: Item}>;
	protected middleware: ItemsMiddleware;

	constructor() {
		super();
		this.itemsMap = new Map();
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		let slot = this.middleware.getFirstAvailableSlot(socket);

		let itemAndRoomId = socket.character.room + "-" + data.item_id;
		if (slot >= 0 && this.itemsMap.has(itemAndRoomId)) { // found an empty spot
			socket.character.items.set(slot, this.itemsMap.get(itemAndRoomId).item);
			console.log('picking item', data.item_id);
			this.itemsMap.delete(itemAndRoomId);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.ITEM_PICK, {
				id: socket.character._id,
				item_id: data.item_id,
				slot: slot
			});
		} else {
			this.sendError(data, socket, "No available slots to pick item");
		}
	}

	[SERVER_GETS.ITEM_DROP](data, socket: GameSocket) {
		let slot = data.slot;
		if (this.middleware.hasItem(socket, slot)) {
			let item = socket.character.items[slot];
			console.log("dropping item", item);
			this.emitter.emit(config.SERVER_INNER.ITEMS_DROP, {}, socket, [item]);
			socket.character.items.set(slot, {});
			socket.emit(this.CLIENT_GETS.ITEM_DELETE, { slot });
		} else {
			this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		}
	}

	[config.SERVER_INNER.ITEMS_DROP](data, socket: GameSocket, items: Item[]) {
		let room = socket.character.room;
		let itemsData = [];
		
		items.forEach(item => {
			let itemId = _.uniqueId();
			let itemAndRoomId = room + "-" + itemId;
			let itemData = {
				x: socket.character.position.x,
				y: socket.character.position.y,
				item_id: itemId,
				item
			};
			this.itemsMap.set(itemAndRoomId, itemData);
			itemsData[itemsData.length] = itemData;

			setTimeout(() => {
				if (this.itemsMap.has(itemAndRoomId)) {
					this.itemsMap.delete(itemAndRoomId);
					console.log('removing item', itemId);
					this.io.to(room).emit(this.CLIENT_GETS.ITEM_DISAPPEAR, {
						item_id: itemId
					});
				}
			}, config.ITEM_DROP_LIFE);
		});
		
		this.io.to(room).emit(this.CLIENT_GETS.ITEM_DROP, itemsData);
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

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		this.itemsMap.forEach(itemData => {
			socket.emit(this.CLIENT_GETS.ITEM_DROP, itemData);
		});
	}
};
