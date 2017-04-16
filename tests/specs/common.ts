import { browser, ExpectedConditions, $ } from "protractor/built";
import { login } from "./user/user.common";

const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';

export function raiseBrowser() {
    beforeAll(() => {
        browser.waitForAngularEnabled(false);
        browser.get(URL);
        login();
    });

    afterEach(() => {
        browser.executeScript(`clearResults();`);
    });
};

// export function raiseTwoBrowsers() {
//     // see https://github.com/angular/protractor/blob/master/spec/interaction/interaction_spec.js
//     let newBrowser: {browser2?: ProtractorBrowser} = {};

//     beforeEach(() => {
//         newBrowser.browser2 = browser.forkNewDriverInstance(true, true, true);
//         newBrowser.browser2.ignoreSynchronization = true;
//         newBrowser.browser2.waitForAngularEnabled(false);
//     });

//     // afterEach(done => newBrowser.browser2.quit().then(() => done()));

//     return newBrowser;
// }

export function expectText(text) {
    browser.wait(ExpectedConditions.textToBePresentInElement($("#chat"), text), WAIT_TIME);
}