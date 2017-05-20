import { browser } from 'protractor/built';
import { expectText } from '../common';

export function wearEquip() {
    browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "legs"});`)
    expectText("actor_equip_item");
}

export function unwearEquip() {
    browser.executeScript(`socket.emit("unequipped_item", {from: "legs", to: 0});`)
    expectText("actor_unequip_item");
}

export function dropEquip(clear = true) {
    browser.executeScript(`socket.emit("dropped_equip", {slot: "legs"});`)
    expectText("actor_delete_equip", browser, clear);
}