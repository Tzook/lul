import { raiseBrowser, expectText } from "../common";
import { deleteUser, register } from "./user.common";
import { browser } from "protractor/built";

describe('delete user', () => {
    raiseBrowser();

    describe('failure', () => {
        it('should not allow deleting when user is not logged in', () => {
            browser.executeScript(`deleteUser()`);
            expectText("A user must be logged in for this request.");
        });
    });

    describe('success', () => {
        it('should delete the user if he is logged in', () => {
            register();
            deleteUser();
        });
    });
});