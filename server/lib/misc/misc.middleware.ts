'use strict';
import ItemsMiddleware from '../items/items.middleware';
let itemsConfig = require('../../../server/lib/items/items.config.json');

export default class MiscMiddleware extends ItemsMiddleware {
    public getStackSlots(socket: GameSocket, item: ITEM_INSTANCE, itemInfo: ITEM_MODEL): number[] { 
        let {stack} = item;
        let slots = [];
        for (var slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
			if (!this.hasItem(socket, slot)) {
				slots.push(slot);
                stack -= itemInfo.cap;
			}

            let slotItem = socket.character.items[slot];
            if (slotItem.key === item.key && slotItem.stack < itemInfo.cap) {
				slots.push(slot);
                stack -= (itemInfo.cap - slotItem.stack);
            }
            
            if (stack <= 0) {
                break;
            }
		}
        return stack <= 0 ? slots : [];
    }
};