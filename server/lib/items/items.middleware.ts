'use strict';
import MasterMiddleware from '../master/master.middleware';
let config = require('../../../server/lib/items/items.config.json');

export default class ItemsMiddleware extends MasterMiddleware {

    getFirstAvailableSlot(socket: GameSocket): number {
        for (var slot = 0; slot < config.MAX_ITEMS; slot++) {
			if (!this.hasItem(socket, slot)) {
				break;
			}
		}
        return slot < config.MAX_ITEMS ? slot : -1;
    }

    isValidItemSlot(slot: number): boolean {
        return slot >= 0 && slot < config.MAX_ITEMS;
    }

    hasItem(socket: GameSocket, slot: number): boolean {
        return this.isItem(socket.character.items[slot]);
    }

    isItem(item: ITEM_INSTANCE) {
        return !!item.key;
    }
};