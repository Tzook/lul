Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
describe('session', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow session when user is not logged in (no cookie)', () => {
            built_1.browser.executeScript(`session()`);
            common_1.expectText("A user must be logged in for this request.");
        });
    });
    describe('success', () => {
        it('should logout when the user is logged in', () => {
            common_1.login();
            built_1.browser.executeScript(`session()`);
            common_1.expectText("Logged in through session successfully.");
            common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvdXNlci9zZXNzaW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFvRTtBQUNwRSw0Q0FBMkM7QUFFM0MsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNoQixxQkFBWSxFQUFFLENBQUM7SUFFZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTtZQUNsRSxlQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDM0MsY0FBSyxFQUFFLENBQUM7WUFDUixlQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLG1CQUFVLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUN0RCxlQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9