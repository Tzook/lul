import { browser } from 'protractor/built';
import { expectText, newBrowser, clearLogs, browser3 } from '../common';
import { getItemId, pickItem } from '../items/items.common';
import { createParty, joinParty, leaveParty } from "../party/party.common";
import { TEST_CHAR_NAME, TEST_CHAR_NAME2, TEST_CHAR_NAME3 } from '../character/character.common';

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

        it('should share gold equally among all party members in room', () => {
            createParty();
            joinParty(browser, newBrowser.instance, TEST_CHAR_NAME, TEST_CHAR_NAME2);
            joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
            browser.executeScript(`socket.emit("dropped_gold", {amount: 10});`)
            getItemId().then(itemId => {
                clearLogs();
                browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`)
                expectText(`"amount": 5`);
                leaveParty();
                leaveParty(newBrowser.instance);
                leaveParty(browser3.instance);
                // bring back the gold to the other char
                newBrowser.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
                expectText(`"amount": -5`, newBrowser.instance);
                pickItem();
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
                browser3.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`)
                expectText(`"Character does not have gold to throw!"`, browser3.instance);
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