'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import DropsController from "./drops.controller";
import ItemsRouter from '../items/items.router';
import DropsServices from './drops.services';
let config = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class DropsRouter extends SocketioRouterBase {
    private dropsMap: Map<string, {x, y, item_id, item: ITEM_INSTANCE}> = new Map();
	private lastHandledItem: string;
    protected controller: DropsController;
    protected services: DropsServices;
    protected itemsRouter: ItemsRouter;
	
	init(files, app) {
		this.itemsRouter = files.routers.items;
		this.services = files.services;
		super.init(files, app);
	}

	[SERVER_GETS.ENTERED_ROOM](data, socket: GameSocket) {
		this.dropsMap.forEach(itemData => {
			socket.emit(this.CLIENT_GETS.ITEMS_DROP, [itemData]);
		});
	}

    [config.SERVER_INNER.ITEM_PICK](data, socket: GameSocket, pickItemFn: (item: ITEM_INSTANCE) => {}) {
		let itemAndRoomId = this.controller.getItemId(socket, data.item_id);
        if (!this.dropsMap.has(itemAndRoomId)) {
			if (this.lastHandledItem !== itemAndRoomId) {
				this.sendError(data, socket, "Item does not exist");
			}
		} else {
			let picked = pickItemFn(this.dropsMap.get(itemAndRoomId).item);
			if (picked) {
				console.log('picking item', data.item_id);
				this.dropsMap.delete(itemAndRoomId);
				this.lastHandledItem = itemAndRoomId;
				this.io.to(socket.character.room).emit(this.CLIENT_GETS.ITEM_PICK, {
					id: socket.character._id,
					item_id: data.item_id,
				});
			}
		}
	}

    [config.SERVER_INNER.GENERATE_DROPS](data, socket: GameSocket, drops: DROP_MODEL[]) {
        let items = [];
        drops.forEach(drop => {
			let itemInfo = this.itemsRouter.getItemInfo(drop.key);
			if (itemInfo) {
				let isDropped = this.controller.isDropped(itemInfo.chance);
				if (isDropped) {
					let itemInstance = this.itemsRouter.getItemInstance(drop.key);
					if (itemInfo.cap > 1) {
						itemInstance.stack = this.services.getRandomStack(drop.minStack, drop.maxStack);
					}
                    items.push(itemInstance);
                    console.log("Dropping item from drop!", drop, itemInstance);
                }
			} else {
				this.sendError({key: drop}, socket, "No item info! cannot drop item.");
            }
        });

        if (items.length > 0) {
            this.emitter.emit(config.SERVER_INNER.ITEMS_DROP, data, socket, items);
        }
	}

    [config.SERVER_INNER.ITEMS_DROP](data, socket: GameSocket, items: ITEM_INSTANCE[]) {
		let room = socket.character.room;
		let itemsData = [];
		// convert the items to plain objects
		items = JSON.parse(JSON.stringify(items));
		
		items.forEach(item => {
			let itemId = _.uniqueId();
			let itemAndRoomId = this.controller.getItemId(socket, itemId);
			let itemData = {
				x: data.x || socket.character.position.x,
				y: data.y || socket.character.position.y,
				item_id: itemId,
				item
			};
			this.dropsMap.set(itemAndRoomId, itemData);
			itemsData[itemsData.length] = itemData;

			setTimeout(() => {
				if (this.dropsMap.has(itemAndRoomId)) {
					this.dropsMap.delete(itemAndRoomId);
					console.log('removing item', itemId);
					this.io.to(room).emit(this.CLIENT_GETS.ITEM_DISAPPEAR, {
						item_id: itemId
					});
				}
			}, config.ITEM_DROP_LIFE);
		});

		if (itemsData.length > 0) {
		    this.io.to(room).emit(this.CLIENT_GETS.ITEMS_DROP, itemsData);
        } 
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
				this.sendError(data, socket, "Must provide an object to update locations");
			} else if (!(itemData = this.dropsMap.get(this.controller.getItemId(socket, item.item_id)))) {
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
