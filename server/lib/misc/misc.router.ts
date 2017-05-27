'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsRouter from '../items/items.router';
import MiscMiddleware from "./misc.middleware";
import MiscController from "./misc.controller";

let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let questsConfig = require('../../../server/lib/quests/quests.config.json');
let config = require('../../../server/lib/misc/misc.config.json');

export default class MiscRouter extends SocketioRouterBase {
	protected itemsRouter: ItemsRouter;
    protected middleware: MiscMiddleware;
    protected controller: MiscController;
	
	init(files, app) {
		super.init(files, app);
		this.itemsRouter = files.routers.items;
	}

	[config.SERVER_GETS.ITEM_PICK.name](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!(itemInfo.cap > 1) || itemInfo.key === "gold") {
                return;
            }
            let stack = item.stack;
            let slots = this.middleware.getStackSlots(socket, item, itemInfo);

            console.log("picking up item for slots", item, slots);
            if (slots.length === 0) { 
                this.sendError(data, socket, "No available slots to pick misc item");
            } else {
                this.controller.pickMiscItem(socket, slots, item, itemInfo);
                this.emitter.emit(questsConfig.SERVER_INNER.LOOT_VALUE_CHANGE.name, {id: item.key, value: stack || 1}, socket)
                return true;
            }	
		});
	}

	[config.SERVER_GETS.MISC_DROP.name](data, socket: GameSocket) {
        // let {slot, stack} = data;
        // if (!(stack > 0)) {
		// 	this.sendError(data, socket, "Must mention what stack amount to throw");
        // } else if (!this.middleware.hasItem(socket, slot)) {
		// 	this.sendError(data, socket, "Trying to drop an item but nothing's there!");
		// } else {
		// 	let item = socket.character.items[slot];
        //     let itemToDrop = Object.assign({}, item);
        //     if (stack >= item.stack) {
        //         socket.character.items.set(slot, {});
        //         socket.emit(this.CLIENT_GETS.ITEM_DELETE.name, { slot });
        //         this.miscValueChanged(socket, item.key, -item.stack);
        //     } else {
        //         item.stack -= stack;
        //         itemToDrop.stack = stack;
        //         socket.emit(this.CLIENT_GETS.STACK_CHANGE.name, { slot, amount: item.stack });
        //         this.miscValueChanged(socket, item.key, -stack);
        //     }
        //     console.log("dropping misc item", itemToDrop);
        //     this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
		// }
	}
};
