import { browser } from "protractor/built";
import { raiseBrowser, expectText } from "./common";

describe('signup', () => {
    raiseBrowser();

    describe('failur', () => {
        it('should not allow registering without a username', () => {
            browser.executeScript(`sendPost('/user/register', {});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow registering with a username that is not a string', () => {
            browser.executeScript(`sendPost('/user/register', {username: {}});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow registering without a password', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'testName'});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow registering with a password that is not a string', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'testName', password: {}});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow registering with a password that is not 32 characters long', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'testName', password: 'tooshort'});`);
            expectText("parameter 'password' is out of range.");
        });

        it('should not allow registering with a user already logged in', () => {
            browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
            expectText("Logged in successfully.");
            browser.executeScript(`sendPost('/user/register', {username: 'testingUser', password: '12345678123456781234567812345678'});`);
            expectText("Cannot do this request with a user already logged in.");
        });

        it('should not allow registering a username that is already taken', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'test', password: '12345678123456781234567812345678'});`);
            expectText("Username 'test' is already being used.");
        });
    });

    // describe('success', () => {
        // TODO add delete API so this can be tested..
    // })
});