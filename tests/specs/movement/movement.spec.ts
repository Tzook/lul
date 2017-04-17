import { expectText, newBrowser, clearLogs } from "../common";
import { browser } from "protractor/built";
import { TEST_CHAR_ID } from "../character/character.common";

describe('movement', () => {
    describe('update other character position', () => {
        let x = ((Math.random() * 100) | 0) / 100;
        
        beforeAll(() => {
            browser.executeScript(`socket.emit("movement", {x: "${x}", y: "2.2", z: "-1", angle: "45"});`);
        });

        afterAll(() => clearLogs());
        
        it('should pass movement', () => {
            expectText(`"movement"`, newBrowser.instance, false);
        });
        it('should pass id', () => {
            expectText(`"id": "${TEST_CHAR_ID}"`, newBrowser.instance, false);
        });
        it('should pass x', () => {
            expectText(`"x": "${x}"`, newBrowser.instance, false);
        });
        it('should pass y', () => {
            expectText(`"y": "2.2"`, newBrowser.instance, false);
        });
        it('should pass z', () => {
            expectText(`"z": "-1"`, newBrowser.instance, false);
        });
        it('should pass angle', () => {
            expectText(`"angle": "45"`, newBrowser.instance, false);
        });
    });
});