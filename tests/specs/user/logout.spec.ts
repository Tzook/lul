import { raiseBrowser, expectText } from "../common";
import { login, logout } from "./user.common";
import { browser } from "protractor/built";

describe('logout', () => {
    raiseBrowser();

    describe('failure', () => {
        it('should not allow logout when user is not logged in', () => {
            browser.executeScript(`logout()`);
            expectText("A user must be logged in for this request.");
        });
    });

    describe('success', () => {
        it('should logout when the user is logged in', () => {
            login();
            logout();
        });
    });
});