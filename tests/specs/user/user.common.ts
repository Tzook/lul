import { expectText } from "../common";
import { browser } from "protractor/built";

export function login() {
    browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
    expectText("Logged in successfully.");
}

export function register() {
    browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
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