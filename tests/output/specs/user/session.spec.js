Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
const built_1 = require("protractor/built");
describe('session', () => {
    describe('failure', () => {
        user_common_1.runAllTestsWithoutUser();
        it('should not allow session when user is not logged in (no cookie)', () => {
            built_1.browser.executeScript(`session()`);
            common_1.expectText("A user must be logged in for this request.");
        });
    });
    describe('success', () => {
        it('should logout when the user is logged in', () => {
            built_1.browser.executeScript(`session()`);
            common_1.expectText("Logged in through session successfully.");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvdXNlci9zZXNzaW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF1QztBQUN2QywrQ0FBdUQ7QUFDdkQsNENBQTJDO0FBRTNDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDaEIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixvQ0FBc0IsRUFBRSxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTtZQUNsRSxlQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDM0MsZUFBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuQyxtQkFBVSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=