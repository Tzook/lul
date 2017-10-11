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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3NpZ251cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBQ3ZDLCtDQUFtSTtBQUVuSSxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwQixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzdCLG9DQUFzQixFQUFFLENBQUM7UUFFekIsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDckIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtnQkFDdkQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUN6RCxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO2dCQUN6RSxlQUFPLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7Z0JBQ3JFLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JFLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUZBQW1GLENBQUMsQ0FBQztnQkFDM0csbUJBQVUsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtnQkFDdkQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsb0NBQXNCLE1BQU0sQ0FBQyxDQUFDO2dCQUM5RixtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO2dCQUN6RSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0Isb0JBQW9CLENBQUMsQ0FBQztnQkFDNUcsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtnQkFDbkYsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsb0NBQXNCLDRCQUE0QixDQUFDLENBQUM7Z0JBQ3BILG1CQUFVLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JFLGVBQU8sQ0FBQyxhQUFhLENBQUMsMENBQTBDLDJCQUFhLGlCQUFpQiwyQkFBYSxNQUFNLENBQUMsQ0FBQztnQkFDbkgsbUJBQVUsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUNyQixFQUFFLENBQUMsNkdBQTZHLEVBQUUsR0FBRyxFQUFFO2dCQUNuSCxzQkFBUSxFQUFFLENBQUM7Z0JBQ1gsd0JBQVUsRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxvQ0FBc0IsaUJBQWlCLDJCQUFhLE1BQU0sQ0FBQyxDQUFDO1lBQzVILG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==