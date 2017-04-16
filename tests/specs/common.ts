import { browser, ProtractorBrowser } from "protractor/built";
import { login } from "./user/user.common";

const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';

export function raiseBrowser() {
    beforeAll(() => {
        browser.waitForAngularEnabled(false);
        browser.get(URL);
        browser.executeScript('window.test = true;');
        login();
    });

    afterEach(() => {
        browser.executeScript(`clearResults();`);
    });
};

export function raiseBrowser2() {
    // see https://github.com/angular/protractor/blob/master/spec/interaction/interaction_spec.js
    let newBrowser: {instance?: ProtractorBrowser} = {};

    beforeAll(() => {
        newBrowser.instance = browser.forkNewDriverInstance();
        newBrowser.instance.waitForAngularEnabled(false);
        newBrowser.instance.get(URL);
        newBrowser.instance.executeScript('window.test = true;');
        login(undefined, newBrowser.instance);
    });

    afterAll(done => newBrowser.instance.quit().then(() => done()));

    return newBrowser;
}

export function expectText(text, chosenBrowser = browser) {
    chosenBrowser.wait(chosenBrowser.ExpectedConditions.textToBePresentInElement(chosenBrowser.$("#chat"), text), WAIT_TIME);
}

export function connectChar(charId, chosenBrowser = browser) {
    // IMPORTANT - Protractor has a bug that waiting for angular boolean in forked browsers is ignored.
    // IMPORTANT - I have changed Protractor's NPM package runner.js initProperties' waitForAngularEnabled to false.
    // IMPORTANT - This will possibly be fixed sometime soon, until then it's a small fix
    //
    // TODO move this to socketio folder when it is created
    chosenBrowser.executeScript(`connect(${charId});`);
    expectText(`"connected."`, chosenBrowser);
}

export function disconnect(chosenBrowser = browser) {
    chosenBrowser.executeScript(`disconnect();`);
    expectText(`"disconnected."`, chosenBrowser);
}

export function connectChars(newBrowser) {
    beforeAll(() => {
        connectChar(0);
        connectChar(1, newBrowser.instance);
    });

    afterAll(() => {
        disconnect();
        // disconnect(newBrowser.instance); not needed because we quit the 2nd browser for now
    });
}