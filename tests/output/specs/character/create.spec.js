Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const character_common_1 = require("./character.common");
const user_common_1 = require("../user/user.common");
const built_1 = require("protractor/built");
describe('create character', () => {
    describe('failure', () => {
        describe('logged out user', () => {
            user_common_1.runAllTestsWithoutUser();
            it('should not allow creating a char when logged out', () => {
                built_1.browser.executeScript(`createCharacter({})`);
                common_1.expectText("A user must be logged in for this request.");
            });
            it('should not allow creating a char when user already has 8 chars', () => {
                user_common_1.login(character_common_1.TEST_MAX_CHARS_USERNAME);
                built_1.browser.executeScript(`createCharacter(${JSON.stringify(character_common_1.CREATE_CHAR_PARAMS)})`);
                common_1.expectText("The user already has the maximum amount of characters available.");
                user_common_1.logout();
            });
        });
        it('should not allow creating a char when name has invalid characters', () => {
            built_1.browser.executeScript(`createCharacter({name: "invalid space"})`);
            common_1.expectText("Parameter 'name' is of a bad type. Please use a valid type.");
        });
        it('should not allow creating a char when name is too long', () => {
            built_1.browser.executeScript(`createCharacter({name: "anamethatiswaytoolongtobevalid"})`);
            common_1.expectText("The parameter 'name' is out of range.");
        });
        it('should not allow creating a char when one of the options is missing', () => {
            built_1.browser.executeScript(`createCharacter({name: "${character_common_1.TEST_CHAR_NAME_UNCAUGHT}"})`);
            common_1.expectText("Parameter 'g' is required.");
        });
        it('should not allow creating a char when name is already caught', () => {
            let charParams = Object.assign({}, character_common_1.CREATE_CHAR_PARAMS);
            charParams.name = character_common_1.TEST_CHAR_NAME;
            built_1.browser.executeScript(`createCharacter(${JSON.stringify(charParams)})`);
            common_1.expectText("The name 'test' is already being used.");
        });
    });
    describe('success', () => {
        it('should create a new character', () => {
            character_common_1.createChar();
            character_common_1.deleteChar();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvY3JlYXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF1QztBQUN2Qyx5REFBa0o7QUFDbEoscURBQTRFO0FBQzVFLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDekIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNoQixRQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFDeEIsb0NBQXNCLEVBQUUsQ0FBQztZQUV6QixFQUFFLENBQUMsa0RBQWtELEVBQUU7Z0JBQ25ELGVBQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDN0MsbUJBQVUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdFQUFnRSxFQUFFO2dCQUNqRSxtQkFBSyxDQUFDLDBDQUF1QixDQUFDLENBQUM7Z0JBQy9CLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMscUNBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hGLG1CQUFVLENBQUMsa0VBQWtFLENBQUMsQ0FBQztnQkFDL0Usb0JBQU0sRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUNwRSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDbEUsbUJBQVUsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQ3pELGVBQU8sQ0FBQyxhQUFhLENBQUMsMkRBQTJELENBQUMsQ0FBQztZQUNuRixtQkFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7WUFDdEUsZUFBTyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsMENBQXVCLEtBQUssQ0FBQyxDQUFDO1lBQy9FLG1CQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtZQUMvRCxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxxQ0FBa0IsQ0FBQyxDQUFDO1lBQ3ZELFVBQVUsQ0FBQyxJQUFJLEdBQUcsaUNBQWMsQ0FBQztZQUNqQyxlQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RSxtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQ2hDLDZCQUFVLEVBQUUsQ0FBQztZQUNiLDZCQUFVLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==