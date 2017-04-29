'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsRouter from '../items/items.router';
import MiscMiddleware from "./misc.middleware";
import MiscController from "./misc.controller";

let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = require('../../../server/lib/misc/misc.config.json').SERVER_GETS;

export default class MiscRouter extends SocketioRouterBase {
	protected itemsRouter: ItemsRouter;
    protected middleware: MiscMiddleware;
    protected controller: MiscController;
	
	init(files, app) {
		super.init(files, app);
		this.itemsRouter = files.routers.items;
	}

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!(itemInfo.cap > 1) || itemInfo.key === "gold") {
                return;
            }
            let slots = this.middleware.getStackSlots(socket, item, itemInfo);

            console.log("picking up item for slots", item, slots);
            if (slots.length === 0) { 
                this.sendError(data, socket, "No available slots to pick misc item");
            } else {
                this.controller.pickMiscItem(socket, slots, item, itemInfo);
                return true;
            }	
		});
	}

	[SERVER_GETS.MISC_DROP](data, socket: GameSocket) {
        if (!socket.alive) {
            this.sendError({}, socket, "Character is not alive!");
            return;
        }
		let {slot, stack} = data;
        if (!(stack > 0)) {
			this.sendError(data, socket, "Must mention what stack amount to throw");
        } else if (!this.middleware.hasItem(socket, slot)) {
			this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		} else {
			let item = socket.character.items[slot];
            let itemToDrop = Object.assign({}, item);
            if (stack >= item.stack) {
                socket.character.items.set(slot, {});
                socket.emit(this.CLIENT_GETS.ITEM_DELETE, { slot });
            } else {
                item.stack -= stack;
                itemToDrop.stack = stack;
                socket.emit(this.CLIENT_GETS.STACK_CHANGE, { slot, amount: item.stack });
            }
            console.log("dropping misc item", itemToDrop);
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP, {}, socket, [item]);
		}
	}
};
