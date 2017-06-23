'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import * as _ from 'underscore';
import DropsController from "./drops.controller";
import ItemsRouter from '../items/items.router';
import DropsServices from './drops.services';
import PartyRouter from '../party/party.router';
let config = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class DropsRouter extends SocketioRouterBase {
    private dropsMap: Map<string, Map<string, ITEM_DROP>> = new Map();
	private lastHandledItem: string;
    protected controller: DropsController;
    protected services: DropsServices;
    protected itemsRouter: ItemsRouter;
    protected partyRouter: PartyRouter;
	
	init(files, app) {
		this.itemsRouter = files.routers.items;
        this.partyRouter = files.routers.party;
		this.services = files.services;
		super.init(files, app);
	}

	private getRoomMap(socket: GameSocket) {
		let map = this.dropsMap.get(socket.character.room);
		if (!map) {
			map = new Map();
			this.dropsMap.set(socket.character.room, map);
		}
		return map;
	}

	[SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		this.getRoomMap(socket).forEach(itemData => {
			socket.emit(this.CLIENT_GETS.ITEMS_DROP.name, [itemData]);
		});
	}

    [config.SERVER_INNER.ITEM_PICK.name](data, socket: GameSocket, pickItemFn: (item: ITEM_INSTANCE) => {}) {
		let itemId: string = data.item_id;
		let map = this.getRoomMap(socket);
		if (!map.has(itemId)) {
			if (this.lastHandledItem !== itemId) {
				// the pickup event happens multiple times so if we are still in the same handling process, don't count it as an error
				this.sendError(data, socket, "Item does not exist");
			}
            return;
		}
        let itemDrop = map.get(itemId);
        let owner = itemDrop.owner;
        if (owner && (owner !== socket.character.name && !this.partyRouter.arePartyMembers(owner, socket.character.name))) {
            return this.sendError(data, socket, `Item owner is ${owner} and you are ${socket.character.name}.`);
        }
        let picked = pickItemFn(itemDrop.item);
        if (picked) {
            console.log('picking item', data.item_id);
            map.delete(itemId);
            this.lastHandledItem = itemId;
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.ITEM_PICK.name, {
                id: socket.character._id,
                item_id: data.item_id,
            });
        }
	}

    [config.SERVER_INNER.GENERATE_DROPS.name](data, socket: GameSocket, drops: DROP_MODEL[]) {
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
            this.emitter.emit(config.SERVER_INNER.ITEMS_DROP.name, data, socket, items);
        }
	}

    [config.SERVER_INNER.ITEMS_DROP.name](data, socket: GameSocket, items: ITEM_INSTANCE[]) {
		let room = socket.character.room;
		let itemsData = [];
		let map = this.getRoomMap(socket);
		// convert the items to plain objects
		items = JSON.parse(JSON.stringify(items));
		
		items.forEach(item => {
			let itemId = _.uniqueId("item-");
			let itemData: ITEM_DROP = {
				x: data.x || socket.character.position.x,
				y: data.y || socket.character.position.y,
				item_id: itemId,
				item
			};
			map.set(itemId, itemData);
			itemsData[itemsData.length] = itemData;

			setTimeout(() => {
				if (map.has(itemId)) {
					map.delete(itemId);
					console.log('removing item', itemId);
					this.io.to(room).emit(this.CLIENT_GETS.ITEM_DISAPPEAR.name, {
						item_id: itemId
					});
				}
			}, config.ITEM_DROP_LIFE_TIME);
            
            if (data.owner) {
                itemData.owner = data.owner;

                setTimeout(() => {
                    let item = map.get(itemId);
                    if (item) {
                        delete item.owner;
                        console.log('removing owner from item', itemId);
                        this.io.to(room).emit(this.CLIENT_GETS.ITEM_OWNER_GONE.name, {
                            item_id: itemId
                        });
                    }
                }, config.ITEM_DROP_OWN_TIME);
            }
		});

		if (itemsData.length > 0) {
		    this.io.to(room).emit(this.CLIENT_GETS.ITEMS_DROP.name, itemsData);
        } 
	}

	[SERVER_GETS.ITEMS_LOCATIONS.name](data, socket: GameSocket) {
		let items = data.items;
		if (!_.isArray(items)) {
			return this.sendError(data, socket, "Must provide an array of items to update locations");
		}
		let updatedItems = [];
		let map = this.getRoomMap(socket);
		items.forEach(item => {
			let itemData;
			if (!_.isObject(item)) {
				this.sendError(data, socket, "Must provide an object to update locations");
			} else if (!(itemData = map.get(item.item_id))) {
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
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.ITEMS_LOCATIONS.name, updatedItems);
		}
	}
};
