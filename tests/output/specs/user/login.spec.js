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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL3VzZXIvbG9naW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHNDQUF1QztBQUN2QywrQ0FBb0c7QUFFcEcsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDbkIsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUM3QixvQ0FBc0IsRUFBRSxDQUFDO1FBRXpCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQ3JCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pELGVBQU8sQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDdEQsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtnQkFDbkUsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO2dCQUNsRSxtQkFBVSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO2dCQUNqRCxlQUFPLENBQUMsYUFBYSxDQUFDLHVDQUF1QywyQkFBYSxNQUFNLENBQUMsQ0FBQztnQkFDbEYsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtnQkFDbkUsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsb0JBQW9CLENBQUMsQ0FBQztnQkFDaEcsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDRFQUE0RSxFQUFFLEdBQUcsRUFBRTtnQkFDbEYsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsMkJBQWEsb0RBQW9ELENBQUMsQ0FBQztnQkFDaEksbUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUNyQixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO2dCQUN0RCxtQkFBSyxFQUFFLENBQUM7Z0JBQ1Isb0JBQU0sRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1lBQzVELGVBQU8sQ0FBQyxhQUFhLENBQUMsdUNBQXVDLDJCQUFhLGlCQUFpQiwyQkFBYSxNQUFNLENBQUMsQ0FBQztZQUNoSCxtQkFBVSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=