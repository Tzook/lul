import { expectText, newBrowser } from '../common';
import { browser } from 'protractor/built';
import { TEST_CHAR_NAME2, TEST_CHAR_NAME } from '../character/character.common';
import { createParty, joinParty, leaveParty } from '../party/party.common';

describe('chatting', () => {
    describe('shout', () => {
        beforeAll(() => browser.executeScript(`socket.emit("shouted", {msg: "hi"});`));

        it('should tell the other characters about the shout', () => {
            expectText(`"shout"`, newBrowser.instance);
        });
    });

    describe('chat', () => {
        beforeAll(() => browser.executeScript(`socket.emit("chatted", {msg: "hi"});`));

        it('should tell the other characters about the shout', () => {
            expectText(`"chat"`, newBrowser.instance);
        });
    });

    describe('whisper', () => {
        it('should send an error when other character does not exist', () => {
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "123"});`);
            expectText(`"Failed to find socket for whisper"`);
        });

        it('should allow to whisper others by name', () => {
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${TEST_CHAR_NAME2}"});`);
            expectText(`"whisper"`, newBrowser.instance);
        });

        it('should allow to whisper oneself', () => {
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${TEST_CHAR_NAME}"});`);
            expectText(`"whisper"`);
        });
    });

    describe('party_chat' ,() => {
        beforeAll(() => {
            createParty(browser);
            joinParty(browser, newBrowser.instance, TEST_CHAR_NAME, TEST_CHAR_NAME2);
        });
        it('should communicate through party chat from leader', () => {
            browser.executeScript(`socket.emit("party_chatted", {msg: "hi party"});`);
            expectText(`"hi party"`, newBrowser.instance);
        });
        it('should communicate through party chat from member', () => {
            newBrowser.instance.executeScript(`socket.emit("party_chatted", {msg: "hi party2"});`);
            expectText(`"hi party2"`, browser);
        });
        it('should throw error if char have no party', () => {
            leaveParty(browser);
            leaveParty(newBrowser.instance);
            browser.executeScript(`socket.emit("party_chatted", {msg: "hi party"});`);
            expectText(`"Failed to find party for engaging in party chat"`);
        });
    });
});