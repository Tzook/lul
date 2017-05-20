import { expectText, newBrowser } from '../common';
import { browser } from "protractor/built";
import { wearEquip, unwearEquip } from "./equips.common";

describe('wear equip', () => {
    describe('errors', () => {
        describe('invalid slots', () => {
            afterEach(() => {
                expectText("Invalid slots!");
            });

            it('should tell if got "from" slot lower than 0', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: -1, to: "legs"});`);
            });

            it('should tell if got "from" slot higher than the max', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: 35, to: "legs"});`);
            });

            it('should tell if got "to" slot to something that does not exist', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "panties"});`);
            });

            it('should tell if got "from" slot that does not have any item', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: 10, to: "legs"});`);
            });
        });

        describe('cannot wear equip', () => {
            afterEach(() => {
                expectText("Item cannot be equipped there");
            });

            it('should tell if the equip does not fit to the slot requested', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "head"});`);
            });

            it('should tell if the equip has a lvl requirement above the lvl', () => {
                browser.executeScript(`socket.emit("equipped_item", {from: 1, to: "weapon"});`);
            });
        });
    });

    describe('equip successfully', () => {
        beforeAll(wearEquip);
        afterAll(unwearEquip);
        
        it('should tell about the event to the other actor', () => {
            expectText("actor_equip_item", newBrowser.instance);
        });
    });
});