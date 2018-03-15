
import SocketioRouterBase from '../socketio/socketio.router.base';
import EquipsMiddleware from './equips.middleware';
import ItemsRouter from '../items/items.router';
import EquipsController from './equips.controller';
import config from '../equips/equips.config';
import dropsConfig from '../drops/drops.config';
import EquipsServices from './equips.services';

export default class EquipsRouter extends SocketioRouterBase {
	protected controller: EquipsController;
	protected middleware: EquipsMiddleware;
	protected services: EquipsServices;
	protected mongoose;
	protected itemsRouter: ItemsRouter;
	
	init(files, app) {
		super.init(files, app);
		this.mongoose = files.model.mongoose;
		this.itemsRouter = files.routers.items;
		this.services = files.services;
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.BEGIN,
			this.middleware.isBoss.bind(this.middleware),
			this.controller.beginEquips.bind(this.controller));
	}

	public onConnected(socket: GameSocket) {
		this.services.clearInvalidEquips(socket);
	}

	[config.SERVER_GETS.EQUIP_ITEM.name](data, socket: GameSocket) {
		let from: number = data.from;
		let to: string = data.to;
		if (this.middleware.isValidItemSlot(from)
			&& this.middleware.isValidEquipSlot(to)
			&& this.middleware.hasItem(socket, from)) {

			let item = socket.character.items[from];
			let itemInfo = this.itemsRouter.getItemInfo(item.key);
			if (!itemInfo) {
				this.sendError(data, socket, "Could not find item info for item " + item.key);
			} else if (!this.middleware.canWearEquip(socket, itemInfo, to)) {
				this.sendError(data, socket, "Item cannot be equipped there");
			} else {
				this.middleware.swapEquipAndItem(socket, from, to);

				this.io.to(socket.character.room).emit(this.CLIENT_GETS.EQUIP_ITEM.name, {
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

	[config.SERVER_GETS.UNEQUIP_ITEM.name](data, socket: GameSocket) {
		let from: string = data.from;
		let to: number = data.to;
		if (this.middleware.isValidEquipSlot(from)
			&& this.middleware.isValidItemSlot(to)
			&& this.middleware.hasEquip(socket, from)) {

			if (this.middleware.hasItem(socket, to)
				&& !this.middleware.canWearEquip(socket, this.itemsRouter.getItemInfo(socket.character.items[to].key), from)) {
				// if the wanted slot already has an item, check if it can be replaced
				this.sendError(data, socket, "Cannot unequip to slot!");
			} else {

				this.middleware.swapEquipAndItem(socket, to, from);

				this.io.to(socket.character.room).emit(this.CLIENT_GETS.UNEQUIP_ITEM.name, {
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

	[config.SERVER_GETS.USE_EQUIP.name](data, socket: GameSocket) {
		let slot = this.middleware.getFirstAvailableSlot(socket);
		if (slot >= 0) {
			this.emitter.emit(config.SERVER_GETS.UNEQUIP_ITEM.name, {
				from: data.slot,
				to: slot
			}, socket);
		} else {
			this.sendError(data, socket, "Cannot unequip to slot!");
		}
	}

	[config.SERVER_INNER.ITEM_USE.name](data: {itemSlot: number, itemInfo: ITEM_MODEL}, socket: GameSocket) {
		let {itemSlot, itemInfo} = data;
		if (this.middleware.isValidEquipItem(itemInfo)) {
		   this.emitter.emit(config.SERVER_GETS.EQUIP_ITEM.name, {
			   from: itemSlot,
			   to: itemInfo.type
		   }, socket);
	   }
	}

	[config.SERVER_INNER.WORE_EQUIP.name](data, socket: GameSocket) {
		
	}

	[config.SERVER_GETS.DROP_EQUIP.name](data, socket: GameSocket) {
		let slot = data.slot;
		if (this.middleware.hasEquip(socket, slot)) {
			let equip = socket.character.equips[slot];

			this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, { }, socket, [equip]);

			let ItemsModels = this.mongoose.model("Item");
            const emptyItem = new ItemsModels({});
            socket.character.equips[slot] = emptyItem;
            this.emitter.emit(config.SERVER_INNER.WORE_EQUIP.name, {
                equip: emptyItem,
                oldEquip: equip,
            }, socket);
			this.io.to(socket.character.room).emit(this.CLIENT_GETS.DELETE_EQUIP.name, {
				id: socket.character._id,
				slot
			});
		} else {
			this.sendError(data, socket, "Invalid slot!");
		}
	}
};
