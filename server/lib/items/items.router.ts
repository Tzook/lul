import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsMiddleware from './items.middleware';
import ItemsController from './items.controller';
import ItemsServices from './items.services';
import dropsConfig from '../drops/drops.config';
import config from '../items/items.config';

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
			this.middleware.isBoss.bind(this.middleware),
			this.controller.generateItems.bind(this.controller));
	}

	public onConnected(socket: GameSocket) {
		this.services.clearInvalidItems(socket);
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
    
    public hasItem(socket: GameSocket, slot: number): boolean {
        return this.middleware.hasItem(socket, slot);
    }

	[config.SERVER_INNER.ITEM_PICK.name](data: {item: ITEM_INSTANCE, callback: Function}, socket: GameSocket) {
        let {item, callback} = data;
        let itemInfo = this.getItemInfo(item.key);
        if (itemInfo.cap > 1) {
            return;
        }
        let slot = this.middleware.getFirstAvailableSlot(socket);
        if (!(slot >= 0)) { 
            return this.sendError(data, socket, config.LOGS.INVENTORY_FULL.MSG, true, true);
        }	
        this[config.SERVER_INNER.ITEM_ADD.name]({slots: [slot], item}, socket);
        callback();
	}

	[config.SERVER_INNER.ITEM_ADD.name](data: {slots: number[], item: ITEM_INSTANCE}, socket: GameSocket) {
		let {slots, item} = data;
		let itemInfo = this.getItemInfo(item.key);
		if (!this.middleware.isGold(item) && !this.middleware.isMisc(itemInfo)) {
			socket.character.items.set(slots[0], item);
			socket.emit(this.CLIENT_GETS.ITEM_ADD.name, { slot: slots[0], item });
		}
	}

	[config.SERVER_INNER.ITEM_REMOVE.name](data: {item: ITEM_INSTANCE, slot?: number}, socket: GameSocket) {
		let {item: {stack, key}, slot: forcedSlot} = data;
		let itemInfo = this.getItemInfo(key);
		if (!this.middleware.isMisc(itemInfo)) {
            // we want to loop, but if the slot is already provided - start and end with that slot
            let slot = (forcedSlot || 0) - 1;
            let length = forcedSlot === undefined ? socket.character.items.length : forcedSlot + 1;
            while (++slot < length) {
				let item = socket.character.items[slot];
				if (item.key === key) {
					this.deleteItem(socket, slot);
					if (--stack === 0) {
						break;
					}
				}
			}
		}
	}

	public deleteItem(socket: GameSocket, slot: number) {
		this.services.deleteItem(socket, slot);
		socket.emit(config.CLIENT_GETS.ITEM_DELETE.name, { slot });
	}

	[config.SERVER_GETS.ITEM_DROP.name](data, socket: GameSocket) {
		let slot = data.slot;
		if (!this.middleware.hasItem(socket, slot)) {
			this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		} else {
			let item = socket.character.items[slot];
			this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
			this.deleteItem(socket, slot);
		}
	}

	[config.SERVER_GETS.ITEM_MOVE.name](data, socket: GameSocket) {
		if (!this.middleware.isValidItemSlot(data.from)
		 	|| !this.middleware.isValidItemSlot(data.to)) {
			this.sendError(data, socket, "Invalid slots!");
		} else {
			let itemFrom = socket.character.items[data.from];
			let itemTo = socket.character.items[data.to];

			socket.character.items.set(data.to, itemFrom);
			socket.character.items.set(data.from, itemTo);
			socket.emit(this.CLIENT_GETS.ITEM_MOVE.name, {
				id: socket.character._id,
				from: data.from,
				to: data.to
			});
		}
	}
	
	[config.SERVER_GETS.ITEM_USE.name](data, socket: GameSocket) {
		let itemSlot: number = data.slot;
		if (!this.middleware.isValidItemSlot(itemSlot)) {
			return this.sendError(data, socket, "Invalid slot!");
		}
		let item = socket.character.items[itemSlot];
		let itemInfo = this.services.getItemInfo(item.key);
		if (!itemInfo) {
			return this.sendError(data, socket, "Could not find item info for item " + item.key);
		} 
		this.emitter.emit(config.SERVER_INNER.ITEM_USE.name, {
			itemSlot,
			itemInfo,
		}, socket);		
	}
	
	[config.SERVER_INNER.ITEM_USE.name](data: {itemSlot: number, itemInfo: ITEM_MODEL}, socket: GameSocket) {
		// do nothing, each place handles it
	}
};
