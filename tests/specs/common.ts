import { browser, ProtractorBrowser } from "protractor/built";
import { login } from "./user/user.common";

const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';

export function raiseBrowser(b = {instance: browser}) {
    beforeAll(() => {
        b.instance.waitForAngularEnabled(false);
        b.instance.get(URL);
        b.instance.executeScript('window.test = true;');
        login(undefined, b.instance);
    });
};

export const newBrowser: {instance?: ProtractorBrowser} = {};

export function raiseBrowser2() {
    // see https://github.com/angular/protractor/blob/master/spec/interaction/interaction_spec.js
    beforeAll(() => newBrowser.instance = browser.forkNewDriverInstance());
    raiseBrowser(newBrowser as any);
}

export function clearLogs(b = browser) {
    b.executeScript(`clearResults();`);
}


export function expectText(text, b = browser, clear = true) {
    b.wait(b.ExpectedConditions.textToBePresentInElement(b.$("#chat"), text), WAIT_TIME);
    clear && clearLogs(b);
}

export function connectChar(charId, b = browser) {
    // IMPORTANT - Protractor has a bug that waiting for angular boolean in forked browsers is ignored.
    // IMPORTANT - I have changed Protractor's NPM package runner.js initProperties' waitForAngularEnabled to false.
    // IMPORTANT - This will possibly be fixed sometime soon, until then it's a small fix
    b.executeScript(`connect(${charId});`);
    expectText(`"connected."`, b);
}

export function connectChars() {
    beforeAll(() => {
        connectChar(0);
        connectChar(1, newBrowser.instance);
    });
}