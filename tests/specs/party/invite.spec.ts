import { createParty, leaveParty, joinParty, inviteToParty } from "./party.common";
import { browser } from 'protractor/built';
import { expectText, newBrowser, browser3 } from '../common';
import { TEST_CHAR_NAME, TEST_CHAR_NAME2, TEST_CHAR_NAME3 } from '../character/character.common';

describe('invite to party', () => {
    it('should invite successfully', () => {
        createParty();
        inviteToParty(browser, browser3.instance, TEST_CHAR_NAME3);
        leaveParty();
    });

    it('should not invite if not in party', () => {
        browser.executeScript(`socket.emit("invite_to_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot invite - must be in a party");
    });

    it('should not let inviting if not party leader', () => {
        createParty(newBrowser.instance);
        joinParty(newBrowser.instance, browser, TEST_CHAR_NAME2, TEST_CHAR_NAME);
        browser.executeScript(`socket.emit("invite_to_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot invite - must be party leader");
        leaveParty(newBrowser.instance);
        leaveParty(browser);
    });

    // cannot easily test this case... oh well
    // it('should not let inviting if party is full', () => {
    // });

    it('should not let inviting if other character is offline', () => {
        createParty();
        browser.executeScript(`socket.emit("invite_to_party", {char_name: "random-name-that-is-actually-too-long-to-be-real"});`);
        expectText("Cannot invite - invitee is logged off");
        leaveParty();
    });

    it('should not let inviting if other character is already in party', () => {
        createParty();
        createParty(browser3.instance);
        browser.executeScript(`socket.emit("invite_to_party", {char_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot invite - invitee is already in a party");
        leaveParty();
        leaveParty(browser3.instance);
    });
});