import { browser } from 'protractor/built';
import { expectText, newBrowser, clearLogs } from '../common';
import { getItemId, pickItem } from '../items/items.common';

describe('gold', () => {
    afterAll(() => clearLogs(newBrowser.instance));

    describe('pick', () => {
        it('should tell me how much gold i picked', () => {
            browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
            getItemId().then(itemId => {
                clearLogs();
                browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`)
                expectText(`"amount": 5`);
            });
        });
    });

    describe('drop', () => {
        describe('error', () => {
            it('should not allow to drop gold if didnt specify the amount', () => {
                browser.executeScript(`socket.emit("dropped_gold", {});`)
                expectText(`"Must mention what gold amount to throw"`);
            });

            it('should not allow to drop gold if amount to drop is negative', () => {
                browser.executeScript(`socket.emit("dropped_gold", {amount: -1});`)
                expectText(`"Must mention what gold amount to throw"`);
            });

            it('should not allow to drop gold if amount to drop is zero', () => {
                browser.executeScript(`socket.emit("dropped_gold", {amount: 0});`)
                expectText(`"Must mention what gold amount to throw"`);
            });

            it('should not allow to drop gold if character has zero gold', () => {
                newBrowser.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
                expectText(`"Character does not have gold to throw!"`, newBrowser.instance);
            });
        });

        describe('success', () => {
            afterEach(() => pickItem());

            it('should tell about the gold change', () => {
                browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
                expectText(`"change_gold_amount"`, browser, false);
            });

            it('should take the character value if the character has less than what wanted to throw', () => {
                browser.executeScript(`socket.emit("dropped_gold", {amount: 50});`)
                expectText(`"amount": -20`, browser, false);
            });
            
            it('should tell about the item drop', () => {
                browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
                expectText(`"drop_items"`, browser, false);
            });
        });
    });
});