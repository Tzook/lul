Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const character_common_1 = require("./character.common");
const user_common_1 = require("../user/user.common");
const built_1 = require("protractor/built");
describe('delete character', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow deleting a char when logged out', () => {
            built_1.browser.executeScript(`deleteCharacter({})`);
            common_1.expectText("A user must be logged in for this request.");
        });
        it('should not allow deleting a char without providing its id', () => {
            user_common_1.login();
            built_1.browser.executeScript(`deleteCharacter({})`);
            common_1.expectText("Parameter 'id' is of a bad type. Please use a valid type.");
            user_common_1.logout();
        });
        it('should not allow deleting a char when id is invalid', () => {
            user_common_1.login();
            built_1.browser.executeScript(`deleteCharacter({id: 1})`);
            common_1.expectText("The character id does not exist in the user.");
            user_common_1.logout();
        });
        it('should not allow deleting a char when id belongs to a character of another user', () => {
            user_common_1.register();
            built_1.browser.executeScript(`deleteCharacter({id: '58f1d663d1656c7a428c7c23'})`);
            common_1.expectText("The character id does not exist in the user.");
            user_common_1.deleteUser();
        });
    });
    describe('success', () => {
        it('should delete a character', () => {
            user_common_1.login();
            character_common_1.createChar();
            character_common_1.deleteChar();
            user_common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvZGVsZXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFxRDtBQUNyRCx5REFBNEQ7QUFDNUQscURBQTBFO0FBQzFFLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDekIscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDbkQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzdDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM1RCxtQkFBSyxFQUFFLENBQUM7WUFDUixlQUFPLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDN0MsbUJBQVUsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1lBQ3hFLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1lBQ3RELG1CQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU8sQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNsRCxtQkFBVSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDM0Qsb0JBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUZBQWlGLEVBQUU7WUFDbEYsc0JBQVEsRUFBRSxDQUFDO1lBQ1gsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1lBQzNFLG1CQUFVLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUMzRCx3QkFBVSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzVCLG1CQUFLLEVBQUUsQ0FBQztZQUNSLDZCQUFVLEVBQUUsQ0FBQztZQUNiLDZCQUFVLEVBQUUsQ0FBQztZQUNiLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9