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

export function login() {
    browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
    expectText("Logged in successfully.");
}

export function logout() {
    browser.executeScript(`logout()`);
    expectText("Logged out successfully.");
}

export function deleteUser() {
    browser.executeScript(`deleteUser()`);
    expectText("User successfully deleted.");
}