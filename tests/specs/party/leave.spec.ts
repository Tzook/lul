import { createParty, leaveParty, joinParty } from "./party.common";
import { browser } from 'protractor/built';
import { expectText, browser3 } from '../common';
import { TEST_CHAR_NAME, TEST_CHAR_NAME3 } from '../character/character.common';

describe('leave party', () => {
    it('should leave party successfully if in a party', () => {
        createParty();
        leaveParty();
    });

    it('should make someone else the leader if were leader', () => {
        createParty();
        joinParty(browser, browser3.instance, TEST_CHAR_NAME, TEST_CHAR_NAME3);
        leaveParty();
        expectText("actor_lead_party", browser3.instance);
        leaveParty(browser3.instance);
    });

    it('should not allow to leave party if not in a party', () => {
        browser.executeScript(`socket.emit("leave_party", {});`);
        expectText("Cannot leave - must be in a party");
    });
});