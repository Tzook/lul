'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import EquipsMiddleware from './equips.middleware';
import ItemsRouter from '../items/items.router';
let config = require('../../../server/lib/equips/equips.config.json');
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = config.SERVER_GETS;

export default class EquipsRouter extends SocketioRouterBase {
	protected middleware: EquipsMiddleware;
	protected mongoose;
	protected itemsRouter: ItemsRouter;
	
	init(files, app) {
		super.init(files, app);
		this.mongoose = files.model.mongoose;
		this.itemsRouter = files.routers.items;
	}

	[SERVER_GETS.EQUIP_ITEM](data, socket: GameSocket) {
		if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		let from: number = data.from;
		let to: string = data.to;
		if (this.middleware.isValidItemSlot(from)
			&& this.middleware.isValidEquipSlot(to)
			&& this.middleware.hasItem(socket, from)) {

			let item = socket.character.items[from];
			let itemInfo = this.itemsRouter.getItemInfo(item.key);
			if (!itemInfo) {
				this.sendError(data, socket, "Could not find item info for item " + item.key);
			} else if (!this.middleware.canWearEquip(itemInfo, to)) {
				this.sendError(data, socket, "Item cannot be equipped there");
			} else {
				console.log("equipping item", from, to);
				this.middleware.swapEquipAndItem(socket, from, to);

				this.io.to(socket.character.room).emit(this.CLIENT_GETS.EQUIP_ITEM, {
					id: socket.character._id,
					from,
					to,
					equipped_item: item,
				});
			}
		} else {
			this.sendError(data, socket, "Invalid slots!");
		}
	}

	[SERVER_GETS.UNEQUIP_ITEM](data, socket: GameSocket) {
		if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		let from: string = data.from;
		let to: number = data.to;
		if (this.middleware.isValidEquipSlot(from)
			&& this.middleware.isValidItemSlot(to)
			&& this.middleware.hasEquip(socket, from)) {

			if (this.middleware.hasItem(socket, to)
				&& !this.middleware.canWearEquip(this.itemsRouter.getItemInfo(socket.character.items[to].key), from)) {
				// if the wanted slot already has an item, check if it can be replaced
				this.sendError(data, socket, "Cannot unequip to slot!");
			} else {
				console.log("unequipping item", from, to);

				this.middleware.swapEquipAndItem(socket, to, from);

				this.io.to(socket.character.room).emit(this.CLIENT_GETS.UNEQUIP_ITEM, {
					id: socket.character._id,
					from,
					to,
					equipped_item: socket.character.equips[from],
				});
			}
		} else {
			this.sendError(data, socket, "Invalid slots!");
		}
	}

	[SERVER_GETS.USE_EQUIP](data, socket: GameSocket) {
		let slot = this.middleware.getFirstAvailableSlot(socket);
		if (slot >= 0) {
			this[SERVER_GETS.UNEQUIP_ITEM]({
				from: data.slot,
				to: slot
			}, socket);
		} else {
			this.sendError(data, socket, "Cannot unequip to slot!");
		}
	}

	[SERVER_GETS.USE_ITEM](data, socket: GameSocket) {
		let itemSlot: number = data.slot;
		if (this.middleware.isValidItemSlot(itemSlot)) {
			let item = socket.character.items[itemSlot];
			let itemInfo = this.itemsRouter.getItemInfo(item.key);
			if (!itemInfo) {
				this.sendError(data, socket, "Could not find item info for item " + item.key);
			} else if (this.middleware.isValidEquipItem(itemInfo)) {
				this[SERVER_GETS.EQUIP_ITEM]({
					from: itemSlot,
					to: itemInfo.type
				}, socket);
			} else {
				this.sendError(data, socket, "Item not equipable!");
			}
		} else {
			this.sendError(data, socket, "Invalid slot!");
		}
	}

	[SERVER_GETS.DROP_EQUIP](data, socket: GameSocket) {
		if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		let slot = data.slot;
		if (this.middleware.hasEquip(socket, slot)) {
			let equip = socket.character.equips[slot];
			console.log("dropping equip", equip);

			this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP, { }, socket, [equip]);

			let ItemsModels = this.mongoose.model("Item");
			socket.character.equips[slot] = new ItemsModels({});
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.DELETE_EQUIP, {
				id: socket.character._id,
				slot
			});
		} else {
			this.sendError(data, socket, "Invalid slot!");
		}
	}
};
