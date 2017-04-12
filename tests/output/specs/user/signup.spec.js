Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
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
            common_1.login();
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
            common_1.logout();
        });
        it('should not allow registering a username that is already taken', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'test', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Username 'test' is already being used.");
        });
    });
    fdescribe('success', () => {
        it('should create a new user when logged out and has a valid username and password, and log it in automatically', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Registered and then logged in successfully.");
            common_1.deleteUser();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3NpZ251cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQWdGO0FBRWhGLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDZixxQkFBWSxFQUFFLENBQUM7SUFFZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNsRCxlQUFPLENBQUMsYUFBYSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDekQsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO1lBQ3BFLGVBQU8sQ0FBQyxhQUFhLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUNyRSxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUU7WUFDaEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1lBQzNHLG1CQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNsRCxlQUFPLENBQUMsYUFBYSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7WUFDckYsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO1lBQ3BFLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkVBQTJFLENBQUMsQ0FBQztZQUNuRyxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkVBQTZFLEVBQUU7WUFDOUUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1lBQzNHLG1CQUFVLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtZQUM3RCxjQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkdBQTJHLENBQUMsQ0FBQztZQUNuSSxtQkFBVSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDcEUsZUFBTSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtZQUNoRSxlQUFPLENBQUMsYUFBYSxDQUFDLCtGQUErRixDQUFDLENBQUM7WUFDdkgsbUJBQVUsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsU0FBUyxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyw2R0FBNkcsRUFBRTtZQUM5RyxlQUFPLENBQUMsYUFBYSxDQUFDLDJHQUEyRyxDQUFDLENBQUM7WUFDbkksbUJBQVUsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1lBQzFELG1CQUFVLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==