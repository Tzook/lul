Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
const built_1 = require("protractor/built");
describe('logout', () => {
    user_common_1.runAllTestsWithoutUser();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb3V0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL2xvZ291dC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsK0NBQXNFO0FBQ3RFLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2Ysb0NBQXNCLEVBQUUsQ0FBQztJQUV6QixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUNyRCxlQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDM0MsbUJBQUssRUFBRSxDQUFDO1lBQ1Isb0JBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=