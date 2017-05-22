import { expectText, newBrowser } from '../common';
import { browser } from 'protractor/built';
import { TEST_CHAR_NAME2, TEST_CHAR_NAME } from '../character/character.common';

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
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "123"});`)
            expectText(`"Failed to find socket for whisper"`);
        });

        it('should allow to whisper others by name', () => {
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${TEST_CHAR_NAME2}"});`)
            expectText(`"whisper"`, newBrowser.instance);
        });

        it('should allow to whisper oneself', () => {
            browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${TEST_CHAR_NAME}"});`)
            expectText(`"whisper"`);
        });
    });
});