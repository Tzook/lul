import { browser } from "protractor/built";
import { expectText } from "../common";

export const TEST_CHAR_NAME = "test";
export const TEST_CHAR_ID = "58f1d663d1656c7a428c7c23";
export const TEST_CHAR_NAME2 = "test2";
export const TEST_CHAR_NAME_UNCAUGHT = "uncaughtTestName";
export const CREATE_CHAR_PARAMS = {name: TEST_CHAR_NAME_UNCAUGHT, hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1"};

export const TEST_MAX_CHARS_USERNAME = 'testMaxChars';

export function createChar(params = CREATE_CHAR_PARAMS) {
    browser.executeScript(`createCharacter(${JSON.stringify(params)});`);
    expectText("Character has been created successfully.");
}

export function deleteChar(index = 2) {
    browser.executeScript(`deleteCharacter({id: characters[${index}]._id});`);
    expectText("Character has been deleted successfully.");
}