Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
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
            user_common_1.login();
            built_1.browser.executeScript(`session()`);
            common_1.expectText("Logged in through session successfully.");
            user_common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvdXNlci9zZXNzaW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFxRDtBQUNyRCwrQ0FBOEM7QUFDOUMsNENBQTJDO0FBRTNDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDaEIscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsaUVBQWlFLEVBQUU7WUFDbEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuQyxtQkFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzNDLG1CQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsbUJBQVUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1lBQ3RELG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9