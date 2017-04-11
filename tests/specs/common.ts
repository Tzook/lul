import { browser, ExpectedConditions, $ } from "protractor/built";

const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';

export function raiseBrowser() {
    beforeEach(() => {
        browser.ignoreSynchronization = true;
        browser.get(URL);
    });
};

export function expectText(text) {
    browser.wait(ExpectedConditions.textToBePresentInElement($("#chat"), text), WAIT_TIME);
}