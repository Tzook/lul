import { createParty, leaveParty, changeLeader, joinParty, kickFromParty } from "./party.common";
import { expectText, browser3 } from '../common';
import { browser } from 'protractor/built';
import { TEST_CHAR_NAME3, TEST_CHAR_NAME } from '../character/character.common';

describe('kick from party', () => {
    it('should kick party member successfully', () => {
        createParty(browser);
        joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
        kickFromParty(browser, browser3.instance, TEST_CHAR_NAME3);
        leaveParty(browser);
    });

    it('should not kick member if not in party', () => {
        browser.executeScript(`socket.emit("kick_from_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot kick - must be in a party");
    });

    it('should not kick member if not party leader', () => {
        createParty(browser);
        joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
        changeLeader(browser, browser3.instance, TEST_CHAR_NAME3);
        browser.executeScript(`socket.emit("kick_from_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot kick - must be party leader");
        leaveParty(browser);
        leaveParty(browser3.instance);
    });

    it('should not kick member if other character not in party', () => {
        createParty(browser);
        browser.executeScript(`socket.emit("kick_from_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot kick - character not in party");
        leaveParty(browser);
    });
});