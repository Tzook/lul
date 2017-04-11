Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("./common");
describe('signup', () => {
    common_1.raiseBrowser();
    describe('failur', () => {
        it('should not allow registering without a username', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow registering with a username that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: {}});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow registering without a password', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'testName'});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'testName', password: {}});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow registering with a password that is not 32 characters long', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'testName', password: 'tooshort'});`);
            common_1.expectText("parameter 'password' is out of range.");
        });
        it('should not allow registering with a user already logged in', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Logged in successfully.");
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'testingUser', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
        });
        it('should not allow registering a username that is already taken', () => {
            built_1.browser.executeScript(`sendPost('/user/register', {username: 'test', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Username 'test' is already being used.");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcGVjcy9zaWdudXAuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHFDQUFvRDtBQUVwRCxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2YscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNmLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNsRCxlQUFPLENBQUMsYUFBYSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDekQsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO1lBQ3BFLGVBQU8sQ0FBQyxhQUFhLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUNyRSxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1lBQzdFLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7WUFDM0YsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO1lBQzlFLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkVBQTJFLENBQUMsQ0FBQztZQUNuRyxtQkFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUU7WUFDN0QsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO1lBQ3BILG1CQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN0QyxlQUFPLENBQUMsYUFBYSxDQUFDLHNHQUFzRyxDQUFDLENBQUM7WUFDOUgsbUJBQVUsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2hFLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0ZBQStGLENBQUMsQ0FBQztZQUN2SCxtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUtQLENBQUMsQ0FBQyxDQUFDIn0=