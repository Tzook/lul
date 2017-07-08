
import MasterMiddleware from '../master/master.middleware';
import ItemsServices from './items.services';
import config from '../items/items.config';

export const NO_SLOT = -1;

export default class ItemsMiddleware extends MasterMiddleware {
    protected services: ItemsServices;

    getFirstAvailableSlot(socket: GameSocket, blacklist: Set<number> = new Set()): number {
        for (var slot = 0; slot < config.MAX_ITEMS; slot++) {
            if (blacklist.has(slot)) {
                continue;
            }
			if (!this.hasItem(socket, slot)) {
				break;
			}
		}
        return slot < config.MAX_ITEMS ? slot : NO_SLOT;
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

    isMisc(item: ITEM_MODEL) {
        return item.cap > 1 && !this.isGold(item);
    }

    isGold(item: ITEM_INSTANCE) {
        return item.key === "gold";
    }

    public getStackSlots(socket: GameSocket, item: ITEM_INSTANCE, itemInfo: ITEM_MODEL, blacklist: Set<number> = new Set()): number[] { 
        let {stack} = item;
        let slots = [];
        // step 1 : get slots with the same item, and fill them first
        for (let slot = 0; slot < config.MAX_ITEMS; slot++) {
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
        for (let slot = 0; slot < config.MAX_ITEMS; slot++) {
            if (blacklist.has(slot)) {
                continue;
            }
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

	public getItemsSlots(socket: GameSocket, items: ITEM_INSTANCE[]): false|{[key: string]: number[]} {
		let itemsToSlots = {};
		let blacklist: Set<number> = new Set();
		for (let item of items) {
			let itemInfo = this.services.getItemInfo(item.key);
			if (this.isMisc(itemInfo)) {
				let slots = this.getStackSlots(socket, item, itemInfo, blacklist);
				if (slots.length === 0) {
					return false;
				} else {
					slots.forEach(slot => blacklist.add(slot));
					itemsToSlots[item.key] = slots;
				}
			} else if (!this.isGold(itemInfo)) {
				let slot = this.getFirstAvailableSlot(socket, blacklist);
				if (slot === NO_SLOT) {
					return false;
				} else {
					blacklist.add(slot);
					itemsToSlots[item.key] = [slot];
				}
			}
		}
		return itemsToSlots;
	}
};