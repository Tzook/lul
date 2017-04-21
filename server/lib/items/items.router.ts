'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsMiddleware from "./items.middleware";
import * as _ from 'underscore';
import ItemsController from './items.controller';
let config = require('../../../server/lib/items/items.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class ItemsRouter extends SocketioRouterBase {
	private itemsMap: Map<string, {x, y, item_id, item: Item}>;
	protected middleware: ItemsMiddleware;
	protected controller: ItemsController;

	constructor() {
		super();
		this.itemsMap = new Map();
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		let slot = this.middleware.getFirstAvailableSlot(socket);

		let itemAndRoomId = this.controller.getItemId(socket, data.item_id);
		if (!(slot >= 0)) { 
			this.sendError(data, socket, "No available slots to pick item");
		} else if (!this.itemsMap.has(itemAndRoomId)) {
			this.sendError(data, socket, "Item does not exist");
		} else {
			socket.character.items.set(slot, this.itemsMap.get(itemAndRoomId).item);
			console.log('picking item', data.item_id);
			this.itemsMap.delete(itemAndRoomId);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.ITEM_PICK, {
				id: socket.character._id,
				item_id: data.item_id,
				slot: slot
			});
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
			let itemAndRoomId = this.controller.getItemId(socket, itemId);
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
		
		this.io.to(room).emit(this.CLIENT_GETS.ITEMS_DROP, itemsData);
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
			socket.emit(this.CLIENT_GETS.ITEMS_DROP, [itemData]);
		});
	}

	[SERVER_GETS.ITEMS_LOCATIONS](data, socket: GameSocket) {
		if (!socket.bitch) {
			return this.sendError(data, socket, "Must be bitch to update items locations");
		}
		let items = data.items;
		if (!_.isArray(items)) {
			return this.sendError(data, socket, "Must provide an array of items to update locations");
		}
		let updatedItems = [];
		items.forEach(item => {
			let itemData;
			if (!_.isObject(item)) {
				this.sendError(data, socket, "Must provide an array of items to update locations");
			} else if (!(itemData = this.itemsMap.get(this.controller.getItemId(socket, item.item_id)))) {
				this.sendError(data, socket, `Item with given item_id ${item.item_id} was not found`);
			} else if (!_.isFinite(item.x) || !_.isFinite(item.y)) {
				this.sendError(data, socket, `Item with item_id ${item.item_id} received invalid x and y`);
			} else {
				itemData.x = item.x;
				itemData.y = item.y;
				updatedItems.push(item);
			}
		});
		if (updatedItems.length > 0) {
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.ITEMS_LOCATIONS, updatedItems);
		}
	}
};
