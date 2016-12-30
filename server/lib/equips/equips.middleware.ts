'use strict';
import ItemsMiddleware from '../items/items.middleware';
import {EQUIPS_SCHEMA} from "./equips.model";

export default class EquipsMiddleware extends ItemsMiddleware {
    isValidEquipSlot(slot: string) {
        return slot in EQUIPS_SCHEMA;
    }

    isValidEquipItem(item: Item) {
        return this.isValidEquipSlot(item.type);
    }

    hasEquip(socket: GameSocket, slot: string): boolean {
        return this.isItem(socket.character.equips[slot]);
    }

    canWearEquip(item: Item, slot: string): boolean {
        return item.type === slot;
    }

    swapEquipAndItem(socket: GameSocket, itemSlot: number, equipSlot: string) {
        let item = socket.character.items[itemSlot];
        let currentEquip = socket.character.equips[equipSlot];
        socket.character.equips[equipSlot] = item;
        socket.character.items.set(itemSlot, currentEquip);
    }
};