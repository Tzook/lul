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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvY3JlYXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF1QztBQUN2Qyx5REFBa0o7QUFDbEoscURBQTRFO0FBQzVFLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDN0Isb0NBQXNCLEVBQUUsQ0FBQztZQUV6QixFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO2dCQUN4RCxlQUFPLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQzdDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RFLG1CQUFLLENBQUMsMENBQXVCLENBQUMsQ0FBQztnQkFDL0IsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQ0FBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEYsbUJBQVUsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2dCQUMvRSxvQkFBTSxFQUFFLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRTtZQUN6RSxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDbEUsbUJBQVUsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUM5RCxlQUFPLENBQUMsYUFBYSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7WUFDbkYsbUJBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUMzRSxlQUFPLENBQUMsYUFBYSxDQUFDLDJCQUEyQiwwQ0FBdUIsS0FBSyxDQUFDLENBQUM7WUFDL0UsbUJBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtZQUNwRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxxQ0FBa0IsQ0FBQyxDQUFDO1lBQ3ZELFVBQVUsQ0FBQyxJQUFJLEdBQUcsaUNBQWMsQ0FBQztZQUNqQyxlQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RSxtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7WUFDckMsNkJBQVUsRUFBRSxDQUFDO1lBQ2IsNkJBQVUsRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9