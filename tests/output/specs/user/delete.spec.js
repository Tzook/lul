Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
const built_1 = require("protractor/built");
describe('delete user', () => {
    user_common_1.runAllTestsWithoutUser();
    describe('failure', () => {
        it('should not allow deleting when user is not logged in', () => {
            built_1.browser.executeScript(`deleteUser()`);
            common_1.expectText("A user must be logged in for this request.");
        });
    });
    describe('success', () => {
        it('should delete the user if he is logged in', () => {
            user_common_1.register();
            user_common_1.deleteUser();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL2RlbGV0ZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsK0NBQTZFO0FBQzdFLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3BCLG9DQUFzQixFQUFFLENBQUM7SUFFekIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDdkQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxtQkFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzVDLHNCQUFRLEVBQUUsQ0FBQztZQUNYLHdCQUFVLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==