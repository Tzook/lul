import { browser, ProtractorBrowser } from "protractor/built";
import { login, TEST_USERNAME2, TEST_USERNAME3 } from './user/user.common';

const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';

export function raiseBrowser(b = {instance: browser}, username = undefined) {
    beforeAll(() => {
        b.instance.waitForAngularEnabled(false);
        b.instance.get(URL);
        b.instance.executeScript('window.test = true;');
        login(username, b.instance);
    });
};

export const newBrowser: {instance?: ProtractorBrowser} = {};
export const browser3: {instance?: ProtractorBrowser} = {};

function raiseNewBrowser(b, username) {
    // see https://github.com/angular/protractor/blob/master/spec/interaction/interaction_spec.js
    beforeAll(() => b.instance = browser.forkNewDriverInstance());
    raiseBrowser(b as any, username);
}

export function raiseBrowser2() {
    raiseNewBrowser(newBrowser, TEST_USERNAME2)
}

export function raiseBrowser3() {
    raiseNewBrowser(browser3, TEST_USERNAME3)
}

export function clearLogs(b = browser) {
    b.executeScript(`clearResults();`);
}

export function expectText(text, b = browser, clear = true) {
    b.wait(b.ExpectedConditions.textToBePresentInElement(b.$("#chat"), text), WAIT_TIME);
    clear && clearLogs(b);
}

export function connectChar(b = browser) {
    // IMPORTANT - Protractor has a bug that waiting for angular boolean in forked browsers is ignored.
    // IMPORTANT - I have changed Protractor's NPM package runner.js initProperties' waitForAngularEnabled to false.
    // IMPORTANT - This will possibly be fixed sometime soon, until then it's a small fix
    b.executeScript(`connect(0);`);
    expectText(`"connected."`, b);
}

export function connectChars() {
    beforeAll(() => {
        connectChar();
        connectChar(newBrowser.instance);
        connectChar(browser3.instance);
    });
}

export function getChat(b = browser) {
    return b.$("#chat").getText();
}