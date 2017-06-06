import { browser } from 'protractor/built';
import { expectText, newBrowser } from '../common';

describe('change ability', () => {
    it('should not to change ability if ability name was not provided', () => {
        browser.executeScript(`socket.emit("changed_ability", {});`)
        expectText(`"Must send what ability to use"`);
    });

    it('should not to change ability if ability is not included in the abilities list', () => {
        browser.executeScript(`socket.emit("changed_ability", {ability: "monkey"});`)
        expectText(`"Character cannot change to this ability"`);
    });

    it('should not allow to change ability if its the same ability', () => {
        browser.executeScript(`socket.emit("changed_ability", {ability: "melee"});`)
        expectText(`"Character already has this ability"`);
    });

    it('should change ability and notify other characters if can', () => {
        browser.executeScript(`socket.emit("changed_ability", {ability: "range"});`)
        expectText(`"actor_change_ability"`, newBrowser.instance);
    });
});