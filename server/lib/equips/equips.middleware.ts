
import ItemsMiddleware from '../items/items.middleware';
import {EQUIPS_SCHEMA} from "./equips.model";
import equipsConfig from './equips.config';

export default class EquipsMiddleware extends ItemsMiddleware {
    isValidEquipSlot(slot: string) {
        return slot in EQUIPS_SCHEMA;
    }

    isValidEquipItem(item: ITEM_MODEL) {
        return this.isValidEquipSlot(item.type);
    }

    hasEquip(socket: GameSocket, slot: string): boolean {
        return this.isValidEquipSlot(slot) && this.isItem(socket.character.equips[slot]);
    }

    canWearEquip(socket: GameSocket, item: ITEM_MODEL, slot: string): boolean {
        return this.doesEquipFit(item, slot) && this.hasRequirements(socket, item, slot);
    }

    private doesEquipFit(item: ITEM_MODEL, slot: string): boolean {
        return item.type === slot;
    }

    private hasRequirements(socket: GameSocket, item: ITEM_MODEL, slot: string): boolean {
        for (let stat in (item.req || {})) {
            let itemValue = item.req[stat];
            // we only check against base value
            let charValue = socket.character.stats[stat];
            if (charValue < itemValue) {
                return false;
            }
        }
        return true;
    }

    swapEquipAndItem(socket: GameSocket, itemSlot: number, equipSlot: string) {
        let item = socket.character.items[itemSlot];
        let currentEquip = socket.character.equips[equipSlot];
        socket.character.equips[equipSlot] = item;
        socket.character.items.set(itemSlot, currentEquip);
        socket.emitter.emit(equipsConfig.SERVER_INNER.WORE_EQUIP.name, {
            equip: item,
            oldEquip: currentEquip,
        }, socket);
    }
};