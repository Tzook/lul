Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
describe('login', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow login without a username', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow login with a username that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: {}});`);
            common_1.expectText("Parameter 'username' is required.");
        });
        it('should not allow login without a password', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: 'test'});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow login with a password that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: {}});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow login with a password that does not fit the real password', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: '11112222333344445555666677778888'});`);
            common_1.expectText("Invalid password.");
        });
        it('should not allow login with a user already logged in', () => {
            common_1.login();
            built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
            common_1.logout();
        });
    });
    describe('success', () => {
        it('should login when using valid user information', () => {
            common_1.login();
            common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL3VzZXIvbG9naW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHNDQUFvRTtBQUVwRSxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2QscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDNUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQ3RELG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtZQUM5RCxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDbEUsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzVDLGVBQU8sQ0FBQyxhQUFhLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUN0RSxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDOUQsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1lBQ3BGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUM3RSxlQUFPLENBQUMsYUFBYSxDQUFDLDRGQUE0RixDQUFDLENBQUM7WUFDcEgsbUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3ZELGNBQUssRUFBRSxDQUFDO1lBQ1IsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO1lBQ3BILG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNwRSxlQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNqRCxjQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=