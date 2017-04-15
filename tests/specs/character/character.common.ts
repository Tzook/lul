import { browser } from "protractor/built";
import { expectText } from "../common";

export const createCharParams = {name: "uncaughtTestName", hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1"};

export function createChar() {
    browser.executeScript(`createCharacter({name: "uncaughtTestName", hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1"});`);
    expectText("Character has been created successfully.");
}

export function deleteChar() {
    browser.executeScript(`deleteCharacter({id: characters[1]._id});`);
    expectText("Character has been deleted successfully.");
}