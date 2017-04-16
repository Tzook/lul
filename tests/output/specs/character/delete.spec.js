Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const character_common_1 = require("./character.common");
const user_common_1 = require("../user/user.common");
const built_1 = require("protractor/built");
describe('delete character', () => {
    describe('failure', () => {
        describe('logged out user', () => {
            user_common_1.runAllTestsWithoutUser();
            it('should not allow deleting a char when logged out', () => {
                built_1.browser.executeScript(`deleteCharacter({})`);
                common_1.expectText("A user must be logged in for this request.");
            });
            it('should not allow deleting a char when id belongs to a character of another user', () => {
                user_common_1.register();
                built_1.browser.executeScript(`deleteCharacter({id: '58f1d663d1656c7a428c7c23'})`);
                common_1.expectText("The character id does not exist in the user.");
                user_common_1.deleteUser();
            });
        });
        it('should not allow deleting a char without providing its id', () => {
            built_1.browser.executeScript(`deleteCharacter({})`);
            common_1.expectText("Parameter 'id' is of a bad type. Please use a valid type.");
        });
        it('should not allow deleting a char when id is invalid', () => {
            built_1.browser.executeScript(`deleteCharacter({id: 1})`);
            common_1.expectText("The character id does not exist in the user.");
        });
    });
    describe('success', () => {
        it('should delete a character', () => {
            character_common_1.createChar();
            character_common_1.deleteChar();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvZGVsZXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF1QztBQUN2Qyx5REFBNEQ7QUFDNUQscURBQW1GO0FBQ25GLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDekIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixRQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFDeEIsb0NBQXNCLEVBQUUsQ0FBQztZQUV6QixFQUFFLENBQUMsa0RBQWtELEVBQUU7Z0JBQ25ELGVBQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDN0MsbUJBQVUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlGQUFpRixFQUFFO2dCQUNsRixzQkFBUSxFQUFFLENBQUM7Z0JBQ1gsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO2dCQUMzRSxtQkFBVSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7Z0JBQzNELHdCQUFVLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1lBQzVELGVBQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUM3QyxtQkFBVSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDdEQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2xELG1CQUFVLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDNUIsNkJBQVUsRUFBRSxDQUFDO1lBQ2IsNkJBQVUsRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9