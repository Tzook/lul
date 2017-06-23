import { createParty, leaveParty, changeLeader, joinParty } from "./party.common";
import { expectText, browser3 } from '../common';
import { browser } from 'protractor/built';
import { TEST_CHAR_NAME3, TEST_CHAR_NAME } from '../character/character.common';

describe('switch party leader', () => {
    it('should switch party leader successfully', () => {
        createParty(browser);
        joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
        changeLeader(browser, browser3.instance, TEST_CHAR_NAME3);
        leaveParty(browser);
        leaveParty(browser3.instance);
    });

    it('should not switch lead if not in party', () => {
        browser.executeScript(`socket.emit("change_party_leader", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot switch lead - must be in a party");
    });

    it('should not switch lead if not party leader', () => {
        createParty(browser);
        joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
        changeLeader(browser, browser3.instance, TEST_CHAR_NAME3);
        browser.executeScript(`socket.emit("change_party_leader", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot switch lead - must be party leader");
        leaveParty(browser);
        leaveParty(browser3.instance);
    });

    it('should not switch lead if other character not in party', () => {
        createParty(browser);
        browser.executeScript(`socket.emit("change_party_leader", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot switch lead - character not in party");
        leaveParty(browser);
    });
});