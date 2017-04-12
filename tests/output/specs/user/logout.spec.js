Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
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
            common_1.login();
            common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb3V0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL2xvZ291dC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBb0U7QUFDcEUsNENBQTJDO0FBRTNDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDZixxQkFBWSxFQUFFLENBQUM7SUFFZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUNyRCxlQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDM0MsY0FBSyxFQUFFLENBQUM7WUFDUixlQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9