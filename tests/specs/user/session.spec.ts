import { expectText } from "../common";
import { runAllTestsWithoutUser } from "./user.common";
import { browser } from "protractor/built";

describe('session', () => {
    describe('failure', () => {
        runAllTestsWithoutUser();

        it('should not allow session when user is not logged in (no cookie)', () => {
            browser.executeScript(`session()`);
            expectText("A user must be logged in for this request.");
        });
    });

    describe('success', () => {
        it('should logout when the user is logged in', () => {
            browser.executeScript(`session()`);
            expectText("Logged in through session successfully.");
        });
    });
});