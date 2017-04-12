import { browser } from "protractor/built";
import { raiseBrowser, expectText, login, logout, deleteUser } from "../common";

describe('signup', () => {
    raiseBrowser();

    describe('failure', () => {
        it('should not allow registering without a username', () => {
            browser.executeScript(`sendPost('/user/register', {});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow registering with a username that is not a string', () => {
            browser.executeScript(`sendPost('/user/register', {username: {}});`);
            expectText("Parameter 'username' is required.");
        });

        it('should not allow registering with a username that is too long', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'averyverylongusernamethatisjusttoomuch'});`);
            expectText("The parameter 'username' is out of range.");
        });

        it('should not allow registering without a password', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName'});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow registering with a password that is not a string', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: {}});`);
            expectText("Parameter 'password' is required.");
        });

        it('should not allow registering with a password that is not 32 characters long', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: 'tooshort'});`);
            expectText("parameter 'password' is out of range.");
        });

        it('should not allow registering with a user already logged in', () => {
            login();
            browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
            expectText("Cannot do this request with a user already logged in.");
            logout();
        });

        it('should not allow registering a username that is already taken', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'test', password: '12345678123456781234567812345678'});`);
            expectText("Username 'test' is already being used.");
        });
    });

    describe('success', () => {
        it('should create a new user when logged out and has a valid username and password, and log it in automatically', () => {
            browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
            expectText("Registered and then logged in successfully.");
            deleteUser();
        });
    });
});