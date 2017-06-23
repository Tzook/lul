import { createParty, leaveParty } from "./party.common";
import { browser } from 'protractor/built';
import { expectText } from '../common';

describe('create party', () => {
    it('should create party successfully if not in a party', () => {
        createParty();
        leaveParty();
    });

    it('should not allow to create party if already in a party', () => {
        createParty();
        browser.executeScript(`socket.emit("create_party", {});`);
        expectText("Cannot create - character already in party");
    });
});