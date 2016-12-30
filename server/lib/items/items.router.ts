'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
let config = require('../../../server/lib/items/items.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class ItemsRouter extends SocketioRouterBase {
	private itemsMap: Map<string, {x, y, item_id, item: Item}>;

	constructor() {
		super();
		this.itemsMap = new Map();
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		for (var slot = 0; slot < config.MAX_ITEMS; slot++) {
			if (!socket.character.items[slot]['name']) {
				break;
			}
		}

		let itemAndRoomId = socket.character.room + "-" + data.item_id;
		if (slot < config.MAX_ITEMS && this.itemsMap.has(itemAndRoomId)) { // found an empty spot
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
		if (socket.character.items[data.slot]['name']) {
			let item = <Item>socket.character.items[data.slot];
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

			console.log('dropping item', itemData);
			socket.character.items.set(data.slot, {});
			socket.emit(this.CLIENT_GETS.ITEM_DELETE, { slot: data.slot });
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
		}
	}

	[SERVER_GETS.ITEM_MOVE](data, socket: GameSocket) {
		if (data.from >= 0 && data.from < config.MAX_ITEMS
		 	&& data.to >= 0 && data.to < config.MAX_ITEMS) {
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
		 }
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		this.itemsMap.forEach(itemData => {
			socket.emit(this.CLIENT_GETS.ITEM_DROP, itemData);
		});
	}
};
