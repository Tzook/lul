import { expectText } from "../common";
import { browser } from "protractor/built";

export const TEST_USERNAME = 'test';
export const TEST_USERNAME_UNCAUGHT = 'uncaughtTestName';
export const TEST_PASSWORD = '12345678123456781234567812345678';

export function login(username = TEST_USERNAME) {
    browser.executeScript(`sendPost('/user/login', {username: '${username}', password: '${TEST_PASSWORD}'});`);
    expectText("Logged in successfully.");
}

export function register(username = TEST_USERNAME_UNCAUGHT) {
    browser.executeScript(`sendPost('/user/register', {username: '${username}', password: '${TEST_PASSWORD}'});`);
    expectText("Registered and then logged in successfully.");        
}

export function logout() {
    browser.executeScript(`logout()`);
    expectText("Logged out successfully.");
}

export function deleteUser() {
    browser.executeScript(`deleteUser()`);
    expectText("User successfully deleted.");
}