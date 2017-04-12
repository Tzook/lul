Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const user_common_1 = require("./user.common");
const built_1 = require("protractor/built");
describe('delete user', () => {
    common_1.raiseBrowser();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL2RlbGV0ZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBcUQ7QUFDckQsK0NBQXFEO0FBQ3JELDRDQUEyQztBQUUzQyxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3BCLHFCQUFZLEVBQUUsQ0FBQztJQUVmLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3ZELGVBQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdEMsbUJBQVUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM1QyxzQkFBUSxFQUFFLENBQUM7WUFDWCx3QkFBVSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=