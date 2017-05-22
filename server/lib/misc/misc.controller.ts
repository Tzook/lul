'use strict';
import MasterController from '../master/master.controller';
import MiscMiddleware from "./misc.middleware";
let itemsConfig = require('../../../server/lib/items/items.config.json');
let config = require('../../../server/lib/misc/misc.config.json');

export default class MiscController extends MasterController {
    protected middleware: MiscMiddleware;

	init(files, app) {
		super.init(files, app);
		this.middleware = files.middleware;
	}

    public pickMiscItem(socket: GameSocket, slots: number[], item: ITEM_INSTANCE, itemInfo: ITEM_MODEL) {
        slots.forEach(slot => {
            if (this.middleware.hasItem(socket, slot)) {
                let slotItem = socket.character.items[slot];
                let stackToAdd = Math.min(item.stack, itemInfo.cap - slotItem.stack);
                slotItem.stack += stackToAdd;
                socket.character.items.set(slot, slotItem);
                item.stack -= stackToAdd;
                socket.emit(config.CLIENT_GETS.STACK_CHANGE.name, { slot, amount: slotItem.stack });
            } else {
                let itemClone = Object.assign({}, item);
                itemClone.stack = Math.min(item.stack, itemInfo.cap);
                socket.character.items.set(slot, itemClone);
                item.stack -= itemClone.stack;
                socket.emit(itemsConfig.CLIENT_GETS.ITEM_ADD.name, { slot, item: itemClone });
            }
        });
    }
};