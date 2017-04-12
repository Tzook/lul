import { raiseBrowser, expectText, login, logout } from "../common";
import { browser } from "protractor/built";

describe('session', () => {
    raiseBrowser();

    describe('failure', () => {
        it('should not allow session when user is not logged in (no cookie)', () => {
            browser.executeScript(`session()`);
            expectText("A user must be logged in for this request.");
        });
    });

    describe('success', () => {
        it('should logout when the user is logged in', () => {
            login();
            browser.executeScript(`session()`);
            expectText("Logged in through session successfully.");
            logout();
        });
    });
});