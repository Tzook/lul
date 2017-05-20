import { expectText, newBrowser } from '../common';
import { browser } from "protractor/built";
import { wearEquip, dropEquip } from "./equips.common";
import { pickItem } from "../items/items.common";

fdescribe('drop equip', () => {
    beforeAll(wearEquip);

    describe('errors', () => {
        describe('invalid slot', () => {
            afterEach(() => {
                expectText("Invalid slot!");
            });

            it('should tell if slot is not a valid equip slot', () => {
                browser.executeScript(`socket.emit("dropped_equip", {slot: "panties"});`);
            });

            it('should tell if slot has no equip', () => {
                browser.executeScript(`socket.emit("dropped_equip", {slot: "head"});`);
            });
        });
    });

    describe('drop successfully', () => {
        beforeAll(() => dropEquip(false));
        afterAll(pickItem);

        it('should tell about the event to the other actor', () => {
            expectText("actor_delete_equip", newBrowser.instance);
        });

        it('should tell about the drop', () => {
            expectText("drop_items", browser, false);
        });
    });
});