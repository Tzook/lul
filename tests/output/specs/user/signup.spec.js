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
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME_UNCAUGHT}'});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME_UNCAUGHT}', password: {}});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not 32 characters long', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME_UNCAUGHT}', password: 'tooshort'});`);
            common_1.expectText("parameter 'password' is out of range.");
        });
        it('should not allow registering with a user already logged in', () => {
            user_common_1.login();
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME_UNCAUGHT}', password: '${user_common_1.TEST_PASSWORD}'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
            user_common_1.logout();
        });
        it('should not allow registering a username that is already taken', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME}', password: '${user_common_1.TEST_PASSWORD}'});`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3NpZ251cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXFEO0FBQ3JELCtDQUEwSDtBQUUxSCxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2YscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3pELG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDckUsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2hFLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUZBQW1GLENBQUMsQ0FBQztZQUMzRyxtQkFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsb0NBQXNCLE1BQU0sQ0FBQyxDQUFDO1lBQzlGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0Isb0JBQW9CLENBQUMsQ0FBQztZQUM1RyxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkVBQTZFLEVBQUU7WUFDOUUsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsb0NBQXNCLDRCQUE0QixDQUFDLENBQUM7WUFDcEgsbUJBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQzdELG1CQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU8sQ0FBQyxhQUFhLENBQUMsMENBQTBDLG9DQUFzQixpQkFBaUIsMkJBQWEsTUFBTSxDQUFDLENBQUM7WUFDNUgsbUJBQVUsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQ3BFLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2hFLGVBQU8sQ0FBQyxhQUFhLENBQUMsMENBQTBDLDJCQUFhLGlCQUFpQiwyQkFBYSxNQUFNLENBQUMsQ0FBQztZQUNuSCxtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDZHQUE2RyxFQUFFO1lBQzlHLHNCQUFRLEVBQUUsQ0FBQztZQUNYLHdCQUFVLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==