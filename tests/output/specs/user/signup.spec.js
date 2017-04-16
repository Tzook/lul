Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const user_common_1 = require("./user.common");
describe('signup', () => {
    describe('logged out user', () => {
        user_common_1.runAllTestsWithoutUser();
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
    describe('logged in user', () => {
        it('should not allow registering with a user already logged in', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: '${user_common_1.TEST_USERNAME_UNCAUGHT}', password: '${user_common_1.TEST_PASSWORD}'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3NpZ251cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBQ3ZDLCtDQUFtSTtBQUVuSSxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2YsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQ3hCLG9DQUFzQixFQUFFLENBQUM7UUFFekIsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNoQixFQUFFLENBQUMsaURBQWlELEVBQUU7Z0JBQ2xELGVBQU8sQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDekQsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO2dCQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7Z0JBQ3JFLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtnQkFDaEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO2dCQUMzRyxtQkFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7Z0JBQ2xELGVBQU8sQ0FBQyxhQUFhLENBQUMsMENBQTBDLG9DQUFzQixNQUFNLENBQUMsQ0FBQztnQkFDOUYsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO2dCQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0Isb0JBQW9CLENBQUMsQ0FBQztnQkFDNUcsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO2dCQUM5RSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0IsNEJBQTRCLENBQUMsQ0FBQztnQkFDcEgsbUJBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO2dCQUNoRSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQywyQkFBYSxpQkFBaUIsMkJBQWEsTUFBTSxDQUFDLENBQUM7Z0JBQ25ILG1CQUFVLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNoQixFQUFFLENBQUMsNkdBQTZHLEVBQUU7Z0JBQzlHLHNCQUFRLEVBQUUsQ0FBQztnQkFDWCx3QkFBVSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtZQUM3RCxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0IsaUJBQWlCLDJCQUFhLE1BQU0sQ0FBQyxDQUFDO1lBQzVILG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==