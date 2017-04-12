import { browser } from "protractor/built";
import { raiseBrowser, expectText, login, logout } from "../common";

describe('login', () => {
    raiseBrowser();

    describe('failure', () => {
        it('should not allow login without a username', () => {
            browser.executeScript(`sendPost('/user/login', {});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow login with a username that is not a string', () => {
            browser.executeScript(`sendPost('/user/login', {username: {}});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow login without a password', () => {
            browser.executeScript(`sendPost('/user/login', {username: 'test'});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow login with a password that is not a string', () => {
            browser.executeScript(`sendPost('/user/login', {username: 'test', password: {}});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow login with a password that does not fit the real password', () => {
            browser.executeScript(`sendPost('/user/login', {username: 'test', password: '11112222333344445555666677778888'});`);
            expectText("Invalid password.");
        });

        it('should not allow login with a user already logged in', () => {
            login();
            browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
            expectText("Cannot do this request with a user already logged in.");
            logout();
        });
    });

    describe('success', () => {
        it('should login when using valid user information', () => {
            login();
            logout();
        });
    });
});