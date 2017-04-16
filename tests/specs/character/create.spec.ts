import { raiseBrowser, expectText } from "../common";
import { deleteChar, createChar, CREATE_CHAR_PARAMS, TEST_CHAR_NAME_UNCAUGHT, TEST_CHAR_NAME, TEST_MAX_CHARS_USERNAME } from "./character.common";
import { login, logout } from "../user/user.common";
import { browser } from "protractor/built";

describe('create character', () => {
    raiseBrowser();
 
    describe('failure', () => {
        it('should not allow creating a char when logged out', () => {
            browser.executeScript(`createCharacter({})`);
            expectText("A user must be logged in for this request.");
        });

        it('should not allow creating a char when name has invalid characters', () => {
            login();
            browser.executeScript(`createCharacter({name: "invalid space"})`);
            expectText("Parameter 'name' is of a bad type. Please use a valid type.");
            logout();
        });

        it('should not allow creating a char when name is too long', () => {
            login();
            browser.executeScript(`createCharacter({name: "anamethatiswaytoolongtobevalid"})`);
            expectText("The parameter 'name' is out of range.");
            logout();
        });

        it('should not allow creating a char when one of the options is missing', () => {
            login();
            browser.executeScript(`createCharacter({name: "${TEST_CHAR_NAME_UNCAUGHT}"})`);
            expectText("Parameter 'g' is required.");
            logout();
        });

        it('should not allow creating a char when name is already caught', () => {
            login();
            let charParams = Object.assign({}, CREATE_CHAR_PARAMS);
            charParams.name = TEST_CHAR_NAME;
            browser.executeScript(`createCharacter(${JSON.stringify(charParams)})`);
            expectText("The name 'test' is already being used.");
            logout();
        });

        it('should not allow creating a char when user already has 8 chars', () => {
            login(TEST_MAX_CHARS_USERNAME);
            browser.executeScript(`createCharacter(${JSON.stringify(CREATE_CHAR_PARAMS)})`);
            expectText("The user already has the maximum amount of characters available.");
            logout();
        });
    });

    describe('success', () => {
        it('should create a new character', () => {
            login();
            createChar();
            deleteChar();
            logout();
        });
    });
});