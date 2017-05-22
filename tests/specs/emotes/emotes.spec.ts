import { browser } from 'protractor/built';
import { expectText, newBrowser } from '../common';

fdescribe('emote', () => {
    beforeAll(() => browser.executeScript(`socket.emit("emoted", {});`));

    it('should tell the other characters about the emote', () => {
        expectText(`"actor_emote"`, newBrowser.instance);
    });
});