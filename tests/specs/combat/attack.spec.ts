import { browser } from 'protractor/built';
import { expectText, newBrowser } from '../common';

describe('attack', () => {
    describe('load', () => {
        beforeAll(() => browser.executeScript(`socket.emit("loaded_attack", {});`));

        it('should tell the other characters about the load', () => {
            expectText(`"actor_load_attack"`, newBrowser.instance);
        });
    });

    describe('perform', () => {
        it('should tell the other characters about the attack', () => {
            browser.executeScript(`socket.emit("performed_attack", {});`)
            expectText(`"actor_perform_attack"`, newBrowser.instance);
        });

        it('pass the rounded load', () => {
            browser.executeScript(`socket.emit("performed_attack", {load: 11.5});`)
            expectText(`"load": 11`, newBrowser.instance);
        });

        it('pass 0 load if value is above the max, 100', () => {
            browser.executeScript(`socket.emit("performed_attack", {load: 200});`)
            expectText(`"load": 0`, newBrowser.instance);
        });

        it('pass 0 load if value is below the min, 0', () => {
            browser.executeScript(`socket.emit("performed_attack", {load: -2});`)
            expectText(`"load": 0`, newBrowser.instance);
        });
    });
});