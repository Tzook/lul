Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const character_common_1 = require("./character.common");
const user_common_1 = require("../user/user.common");
const built_1 = require("protractor/built");
describe('create character', () => {
    common_1.raiseBrowser();
    describe('failure', () => {
        it('should not allow creating a char when logged out', () => {
            built_1.browser.executeScript(`createCharacter({})`);
            common_1.expectText("A user must be logged in for this request.");
        });
        it('should not allow creating a char when name has invalid characters', () => {
            user_common_1.login();
            built_1.browser.executeScript(`createCharacter({name: "invalid space"})`);
            common_1.expectText("Parameter 'name' is of a bad type. Please use a valid type.");
            user_common_1.logout();
        });
        it('should not allow creating a char when name is too long', () => {
            user_common_1.login();
            built_1.browser.executeScript(`createCharacter({name: "anamethatiswaytoolongtobevalid"})`);
            common_1.expectText("The parameter 'name' is out of range.");
            user_common_1.logout();
        });
        it('should not allow creating a char when one of the options is missing', () => {
            user_common_1.login();
            built_1.browser.executeScript(`createCharacter({name: "${character_common_1.TEST_CHAR_NAME_UNCAUGHT}"})`);
            common_1.expectText("Parameter 'g' is required.");
            user_common_1.logout();
        });
        it('should not allow creating a char when name is already caught', () => {
            user_common_1.login();
            let charParams = Object.assign({}, character_common_1.CREATE_CHAR_PARAMS);
            charParams.name = character_common_1.TEST_CHAR_NAME;
            built_1.browser.executeScript(`createCharacter(${JSON.stringify(charParams)})`);
            common_1.expectText("The name 'test' is already being used.");
            user_common_1.logout();
        });
        it('should not allow creating a char when user already has 8 chars', () => {
            user_common_1.login(character_common_1.TEST_MAX_CHARS_USERNAME);
            built_1.browser.executeScript(`createCharacter(${JSON.stringify(character_common_1.CREATE_CHAR_PARAMS)})`);
            common_1.expectText("The user already has the maximum amount of characters available.");
            user_common_1.logout();
        });
    });
    describe('success', () => {
        it('should create a new character', () => {
            user_common_1.login();
            character_common_1.createChar();
            character_common_1.deleteChar();
            user_common_1.logout();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvY3JlYXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFxRDtBQUNyRCx5REFBa0o7QUFDbEoscURBQW9EO0FBQ3BELDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDekIscUJBQVksRUFBRSxDQUFDO0lBRWYsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDbkQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzdDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxtQkFBSyxFQUFFLENBQUM7WUFDUixlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDbEUsbUJBQVUsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1lBQzFFLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQ3pELG1CQUFLLEVBQUUsQ0FBQztZQUNSLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkRBQTJELENBQUMsQ0FBQztZQUNuRixtQkFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7WUFDcEQsb0JBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7WUFDdEUsbUJBQUssRUFBRSxDQUFDO1lBQ1IsZUFBTyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsMENBQXVCLEtBQUssQ0FBQyxDQUFDO1lBQy9FLG1CQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN6QyxvQkFBTSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtZQUMvRCxtQkFBSyxFQUFFLENBQUM7WUFDUixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxxQ0FBa0IsQ0FBQyxDQUFDO1lBQ3ZELFVBQVUsQ0FBQyxJQUFJLEdBQUcsaUNBQWMsQ0FBQztZQUNqQyxlQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RSxtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDckQsb0JBQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0VBQWdFLEVBQUU7WUFDakUsbUJBQUssQ0FBQywwQ0FBdUIsQ0FBQyxDQUFDO1lBQy9CLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMscUNBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEYsbUJBQVUsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1lBQy9FLG9CQUFNLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNoQyxtQkFBSyxFQUFFLENBQUM7WUFDUiw2QkFBVSxFQUFFLENBQUM7WUFDYiw2QkFBVSxFQUFFLENBQUM7WUFDYixvQkFBTSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==