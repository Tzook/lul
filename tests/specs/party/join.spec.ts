import { createParty, leaveParty, inviteToParty, changeLeader, joinParty } from "./party.common";
import { expectText, browser3, newBrowser } from '../common';
import { browser } from 'protractor/built';
import { TEST_CHAR_NAME3, TEST_CHAR_NAME2, TEST_CHAR_NAME } from '../character/character.common';

describe('join party', () => {
    it('should join a party invitation successfully', () => {
        createParty(browser3.instance);
        joinParty(browser3.instance, browser, TEST_CHAR_NAME3, TEST_CHAR_NAME);
        leaveParty(browser3.instance);
        leaveParty(browser);
    });

    it('should not let joining a party if already in party', () => {
        createParty();
        browser.executeScript(`socket.emit("join_party", {leader_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot join - already in party");
        leaveParty();
    });

    it('should not let joining a party if leader is not in a party', () => {
        browser.executeScript(`socket.emit("join_party", {leader_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot join - party is disbanded");
    });

    it('should not let joining a party if leader does not exist', () => {
        browser.executeScript(`socket.emit("join_party", {leader_name: "a-name-that-does-not-exist"});`);
        expectText("Cannot join - party is disbanded");
    });

    it('should not let joining a party when you were not invited', () => {
        createParty(browser3.instance);
        browser.executeScript(`socket.emit("join_party", {leader_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot join - not invited anymore");
        leaveParty(browser3.instance);
    });

    it('should not let joining a party when you were invited by someone but he is not the leader anymore', () => {
        createParty(browser3.instance);
        joinParty(browser3.instance, newBrowser.instance, TEST_CHAR_NAME3, TEST_CHAR_NAME2);
        inviteToParty(browser3.instance, browser, TEST_CHAR_NAME);
        changeLeader(browser3.instance, newBrowser.instance, TEST_CHAR_NAME2);
        browser.executeScript(`socket.emit("join_party", {leader_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot join - party leader has changed");
        leaveParty(browser3.instance);
        leaveParty(newBrowser.instance);
    });

    it('should discard the invitation after joining once', () => {
        createParty(browser3.instance);
        joinParty(browser3.instance, browser, TEST_CHAR_NAME3, TEST_CHAR_NAME);
        leaveParty(browser);
        browser.executeScript(`socket.emit("join_party", {leader_name: "${TEST_CHAR_NAME3}"});`);
        expectText("Cannot join - not invited anymore");
        leaveParty(browser3.instance);
    });
});