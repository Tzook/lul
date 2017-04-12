Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const user_common_1 = require("./user.common");
describe('signup', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow registering without a username', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow registering with a username that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: {}});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow registering with a username that is too long', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'averyverylongusernamethatisjusttoomuch'});`);
            common_1.expectText("The parameter 'username' is out of range.");
        });
        it('should not allow registering without a password', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName'});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: {}});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not 32 characters long', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: 'tooshort'});`);
            common_1.expectText("parameter 'password' is out of range.");
        });
        it('should not allow registering with a user already logged in', () => {
            user_common_1.login();
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
            user_common_1.logout();
        });
        it('should not allow registering a username that is already taken', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'test', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Username 'test' is already being used.");
        });
    });
    describe('success', () => {
        it('should create a new user when logged out and has a valid username and password, and log it in automatically', () => {
            user_common_1.register();
            user_common_1.deleteUser();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3NpZ251cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXFEO0FBQ3JELCtDQUFvRTtBQUVwRSxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2YscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3pELG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDckUsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2hFLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUZBQW1GLENBQUMsQ0FBQztZQUMzRyxtQkFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1lBQ3JGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDJFQUEyRSxDQUFDLENBQUM7WUFDbkcsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO1lBQzlFLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUZBQW1GLENBQUMsQ0FBQztZQUMzRyxtQkFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUU7WUFDN0QsbUJBQUssRUFBRSxDQUFDO1lBQ1IsZUFBTyxDQUFDLGFBQWEsQ0FBQywyR0FBMkcsQ0FBQyxDQUFDO1lBQ25JLG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNwRSxvQkFBTSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtZQUNoRSxlQUFPLENBQUMsYUFBYSxDQUFDLCtGQUErRixDQUFDLENBQUM7WUFDdkgsbUJBQVUsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyw2R0FBNkcsRUFBRTtZQUM5RyxzQkFBUSxFQUFFLENBQUM7WUFDWCx3QkFBVSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=