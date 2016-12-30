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
			console.log("No available slots to pick item", itemAndRoomId);
		}
	}

	[SERVER_GETS.ITEM_DROP](data, socket: GameSocket, item?: Item) {
		let slot = data.slot;
		if (item || this.middleware.hasItem(socket, slot)) {
			item = item || socket.character.items[slot];
			let itemId = _.uniqueId();
			let room = socket.character.room;
			let itemAndRoomId = room + "-" + itemId;
			let itemData = {
				x: socket.character.position.x,
				y: socket.character.position.y,
				item_id: itemId,
				item
			};
			this.itemsMap.set(itemAndRoomId, itemData);

			console.log('dropping item', itemData, 'in slot', slot);
			if (slot >= 0) {
				socket.character.items.set(slot, {});
				socket.emit(this.CLIENT_GETS.ITEM_DELETE, { slot });
			}
			this.io.to(room).emit(this.CLIENT_GETS.ITEM_DROP, itemData);

			setTimeout(() => {
				if (this.itemsMap.has(itemAndRoomId)) {
					this.itemsMap.delete(itemAndRoomId);
					console.log('removing item', itemId);
					this.io.to(room).emit(this.CLIENT_GETS.ITEM_DISAPPEAR, {
						item_id: itemId
					});
				}
			}, config.ITEM_DROP_LIFE);
		} else {
			console.log("trying to drop an item but has no item!", slot)
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
			 console.log("detected invalid slots!", data.from, data.to);
		 }
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		this.itemsMap.forEach(itemData => {
			socket.emit(this.CLIENT_GETS.ITEM_DROP, itemData);
		});
	}
};
