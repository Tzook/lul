import { raiseBrowser, expectText } from "../common";
import { deleteChar, createChar } from "./character.common";
import { login, logout, register, deleteUser } from "../user/user.common";
import { browser } from "protractor/built";

describe('delete character', () => {
    raiseBrowser();
 
    describe('failure', () => {
        it('should not allow deleting a char when logged out', () => {
            browser.executeScript(`deleteCharacter({})`);
            expectText("A user must be logged in for this request.");
        });

        it('should not allow deleting a char without providing its id', () => {
            login();
            browser.executeScript(`deleteCharacter({})`);
            expectText("Parameter 'id' is of a bad type. Please use a valid type.");
            logout();
        });

        it('should not allow deleting a char when id is invalid', () => {
            login();
            browser.executeScript(`deleteCharacter({id: 1})`);
            expectText("The character id does not exist in the user.");
            logout();
        });

        it('should not allow deleting a char when id belongs to a character of another user', () => {
            register();
            browser.executeScript(`deleteCharacter({id: '58f1d663d1656c7a428c7c23'})`);
            expectText("The character id does not exist in the user.");
            deleteUser();
        });
    });

    describe('success', () => {
        it('should delete a character', () => {
            login();
            createChar();
            deleteChar();
            logout();
        });
    });
});