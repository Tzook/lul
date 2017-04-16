Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const user_common_1 = require("./user.common");
describe('login', () => {
    describe('logged out user', () => {
        user_common_1.runAllTestsWithoutUser();
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
        });
        describe('success', () => {
            it('should login when using valid user information', () => {
                user_common_1.login();
                user_common_1.logout();
            });
        });
    });
    describe('logged in user', () => {
        it('should not allow login with a user already logged in', () => {
            built_1.browser.executeScript(`sendPost('/user/login', {username: '${user_common_1.TEST_USERNAME}', password: '${user_common_1.TEST_PASSWORD}'});`);
            common_1.expectText("Cannot do this request with a user already logged in.");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL3VzZXIvbG9naW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHNDQUF1QztBQUN2QywrQ0FBb0c7QUFFcEcsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNkLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUN4QixvQ0FBc0IsRUFBRSxDQUFDO1FBRXpCLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDaEIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO2dCQUM1QyxlQUFPLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBQ3RELG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtnQkFDOUQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO2dCQUNsRSxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7Z0JBQzVDLGVBQU8sQ0FBQyxhQUFhLENBQUMsdUNBQXVDLDJCQUFhLE1BQU0sQ0FBQyxDQUFDO2dCQUNsRixtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7Z0JBQzlELGVBQU8sQ0FBQyxhQUFhLENBQUMsdUNBQXVDLDJCQUFhLG9CQUFvQixDQUFDLENBQUM7Z0JBQ2hHLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtnQkFDN0UsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsb0RBQW9ELENBQUMsQ0FBQztnQkFDaEksbUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtnQkFDakQsbUJBQUssRUFBRSxDQUFDO2dCQUNSLG9CQUFNLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN2QixFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDdkQsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsaUJBQWlCLDJCQUFhLE1BQU0sQ0FBQyxDQUFDO1lBQ2hILG1CQUFVLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==