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
                built_1.browser.executeScript(`deleteCharacter({id: '${character_common_1.TEST_CHAR_ID}'})`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jaGFyYWN0ZXIvZGVsZXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF1QztBQUN2Qyx5REFBMEU7QUFDMUUscURBQW1GO0FBQ25GLDRDQUEyQztBQUUzQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDN0Isb0NBQXNCLEVBQUUsQ0FBQztZQUV6QixFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO2dCQUN4RCxlQUFPLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQzdDLG1CQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxpRkFBaUYsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZGLHNCQUFRLEVBQUUsQ0FBQztnQkFDWCxlQUFPLENBQUMsYUFBYSxDQUFDLHlCQUF5QiwrQkFBWSxLQUFLLENBQUMsQ0FBQztnQkFDbEUsbUJBQVUsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO2dCQUMzRCx3QkFBVSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7WUFDakUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzdDLG1CQUFVLENBQUMsMkRBQTJELENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDM0QsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2xELG1CQUFVLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDckIsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNqQyw2QkFBVSxFQUFFLENBQUM7WUFDYiw2QkFBVSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=