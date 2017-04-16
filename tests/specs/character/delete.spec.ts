import { expectText } from "../common";
import { deleteChar, createChar } from "./character.common";
import { register, deleteUser, runAllTestsWithoutUser } from "../user/user.common";
import { browser } from "protractor/built";

describe('delete character', () => {
    describe('failure', () => {
        describe('logged out user', () => {
            runAllTestsWithoutUser();

            it('should not allow deleting a char when logged out', () => {
                browser.executeScript(`deleteCharacter({})`);
                expectText("A user must be logged in for this request.");
            });

            it('should not allow deleting a char when id belongs to a character of another user', () => {
                register();
                browser.executeScript(`deleteCharacter({id: '58f1d663d1656c7a428c7c23'})`);
                expectText("The character id does not exist in the user.");
                deleteUser();
            });
        });

        it('should not allow deleting a char without providing its id', () => {
            browser.executeScript(`deleteCharacter({})`);
            expectText("Parameter 'id' is of a bad type. Please use a valid type.");
        });

        it('should not allow deleting a char when id is invalid', () => {
            browser.executeScript(`deleteCharacter({id: 1})`);
            expectText("The character id does not exist in the user.");
        });
    });

    describe('success', () => {
        it('should delete a character', () => {
            createChar();
            deleteChar();
        });
    });
});