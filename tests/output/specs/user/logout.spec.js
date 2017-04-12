Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
const built_1 = require("protractor/built");
describe('logout', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow logout when user is not logged in', () => {
            built_1.browser.executeScript(`logout()`);
            common_1.expectText("A user must be logged in for this request.");
        });
    });
    describe('success', () => {
        it('should logout when the user is logged in', () => {
            user_common_1.login();
            user_common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb3V0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL2xvZ291dC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBcUQ7QUFDckQsK0NBQThDO0FBQzlDLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2YscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDckQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxtQkFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzNDLG1CQUFLLEVBQUUsQ0FBQztZQUNSLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9