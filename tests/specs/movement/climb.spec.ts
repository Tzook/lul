import { expectText, newBrowser, clearLogs } from "../common";
import { browser } from "protractor/built";
import { TEST_CHAR_ID } from "../character/character.common";

describe('climb', () => {
    describe('started climbing', () => {
        beforeAll(() => {
            browser.executeScript(`socket.emit("started_climbing", {});`);
        });

        afterAll(() => clearLogs());
        
        it('should tell the other client that a character has started climbing', () => {
            expectText(`"actor_start_climbing"`, newBrowser.instance, false);
        });
        
        it('should pass id', () => {
            expectText(`"id": "${TEST_CHAR_ID}"`, newBrowser.instance, false);
        });
    });

    describe('stopped climbing', () => {
        beforeAll(() => {
            browser.executeScript(`socket.emit("stopped_climbing", {});`);
        });

        afterAll(() => clearLogs());
        
        it('should tell the other client that a character has started climbing', () => {
            expectText(`"actor_stop_climbing"`, newBrowser.instance, false);
        });
        
        it('should pass id', () => {
            expectText(`"id": "${TEST_CHAR_ID}"`, newBrowser.instance, false);
        });
    });
});