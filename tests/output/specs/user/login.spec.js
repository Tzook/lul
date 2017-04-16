Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const user_common_1 = require("./user.common");
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
            built_1.browser.executeScript(`sendPost('/user/login', {username: '${user_common_1.TEST_USERNAME}'});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow login with a password that is not a string', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: '${user_common_1.TEST_USERNAME}', password: {}});`);
            common_1.expectText("Parameter 'password' is required.");
        });
        it('should not allow login with a password that does not fit the real password', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: '${user_common_1.TEST_USERNAME}', password: '11112222333344445555666677778888'});`);
            common_1.expectText("Invalid password.");
        });
        it('should not allow login with a user already logged in', () => {
            user_common_1.login();
            built_1.browser.executeScript(`sendPost('/user/login', {username: '${user_common_1.TEST_USERNAME}', password: '${user_common_1.TEST_PASSWORD}'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
            user_common_1.logout();
        });
    });
    describe('success', () => {
        it('should login when using valid user information', () => {
            user_common_1.login();
            user_common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL3VzZXIvbG9naW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHNDQUFxRDtBQUNyRCwrQ0FBNEU7QUFFNUUsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNkLHFCQUFZLEVBQUUsQ0FBQztJQUVmLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzVDLGVBQU8sQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUN0RCxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDOUQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQ2xFLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM1QyxlQUFPLENBQUMsYUFBYSxDQUFDLHVDQUF1QywyQkFBYSxNQUFNLENBQUMsQ0FBQztZQUNsRixtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDOUQsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsb0JBQW9CLENBQUMsQ0FBQztZQUNoRyxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUU7WUFDN0UsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsb0RBQW9ELENBQUMsQ0FBQztZQUNoSSxtQkFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDdkQsbUJBQUssRUFBRSxDQUFDO1lBQ1IsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsaUJBQWlCLDJCQUFhLE1BQU0sQ0FBQyxDQUFDO1lBQ2hILG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNwRSxvQkFBTSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDakQsbUJBQUssRUFBRSxDQUFDO1lBQ1Isb0JBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=