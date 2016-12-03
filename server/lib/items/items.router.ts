'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
let config = require('../../../server/lib/items/items.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class ItemsRouter extends SocketioRouterBase {
	private itemsMap: Map<string, Item>;

	constructor() {
		super();
		this.itemsMap = new Map();
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		for (var slot = 0; slot < config.MAX_ITEMS; slot++) {
			if (!socket.character.items[slot]) {
				break;
			}
		}

		let itemAndRoomId = socket.character.room + "-" + data.item_id;
		if (slot < config.MAX_ITEMS && this.itemsMap.has(itemAndRoomId)) { // found an empty spot
			socket.character.items[slot] = this.itemsMap.get(itemAndRoomId);
			this.itemsMap.delete(itemAndRoomId);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.ITEM_PICK, {
				id: socket.character._id,
				item_id: data.item_id,
				slot: slot
			});
		}
	}

	[SERVER_GETS.ITEM_DROP](data, socket: GameSocket) {
		if (socket.character.items[data.slot]) {
			let item = socket.character.items[data.slot];
			let itemId = _.uniqueId();
			let room = socket.character.room;
			let itemAndRoomId = room + "-" + itemId;
			this.itemsMap.set(itemAndRoomId, item);

			socket.character.items[data.slot] = undefined;
			this.io.to(room).emit(this.CLIENT_GETS.ITEM_DROP, {
				x: socket.character.position.x,
				y: socket.character.position.y,
				item_id: itemId,
				item
			});

			setTimeout(() => {
				if (this.itemsMap.has(itemAndRoomId)) {
					this.itemsMap.delete(itemAndRoomId);
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
			let temp = socket.character.items[data.from];
			socket.character.items[data.from] = socket.character.items[data.to];
			socket.character.items[data.to] = temp;
		 }
	}
};
