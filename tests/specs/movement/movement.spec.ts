import { raiseBrowser2, connectChars, expectText } from "../common";
import { browser } from "protractor/built";
import { TEST_CHAR_ID } from "../character/character.common";

fdescribe('movement', () => {
    let newBrowser = raiseBrowser2();
    connectChars(newBrowser);
    
    it('should update other characters the position', () => {
        let x = ((Math.random() * 100) | 0) / 100;
        browser.executeScript(`socket.emit("movement", {x: "${x}", y: "2.2", z: "-1", angle: "45"});`);
        expectText(`"movement"`, newBrowser.instance);
        expectText(`"id": "${TEST_CHAR_ID}"`, newBrowser.instance);
        expectText(`"x": "${x}"`, newBrowser.instance);
        expectText(`"y": "2.2"`, newBrowser.instance);
        expectText(`"z": "-1"`, newBrowser.instance);
        expectText(`"angle": "45"`, newBrowser.instance);
    });
});