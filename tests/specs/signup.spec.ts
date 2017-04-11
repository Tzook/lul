import { browser, by, element } from "protractor/built";

describe('signup', () => {
    beforeEach(() => {
        browser.ignoreSynchronization = true;
        browser.get('http://localhost:5000/');
    });

    it('should not allow registering without a username and a password', () => {
        element(by.id("register")).click();
        
    });
});