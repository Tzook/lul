'use strict';
import ItemsMiddleware from '../items/items.middleware';
let itemsConfig = require('../../../server/lib/items/items.config.json');

export default class MiscMiddleware extends ItemsMiddleware {
    public getStackSlots(socket: GameSocket, item: ITEM_INSTANCE, itemInfo: ITEM_MODEL): number[] { 
        let {stack} = item;
        let slots = [];
        // step 1 : get slots with the same item, and fill them first
        for (let slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
            if (stack <= 0) {
                break;
            }
            let slotItem = socket.character.items[slot];
            if (slotItem.key === item.key && slotItem.stack < itemInfo.cap) {
				slots.push(slot);
                stack -= (itemInfo.cap - slotItem.stack);
            }
		}

        // step 2 : get empty slots 
        for (let slot = 0; slot < itemsConfig.MAX_ITEMS; slot++) {
            if (stack <= 0) {
                break;
            }
            if (!this.hasItem(socket, slot)) {
				slots.push(slot);
                stack -= itemInfo.cap;
			}
        }

        return stack <= 0 ? slots : [];
    }
};