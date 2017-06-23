Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
describe('kick from party', () => {
    it('should kick party member successfully', () => {
        party_common_1.createParty(built_1.browser);
        party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
        party_common_1.kickFromParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME3);
        party_common_1.leaveParty(built_1.browser);
    });
    it('should not kick member if not in party', () => {
        built_1.browser.executeScript(`socket.emit("kick_from_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot kick - must be in a party");
    });
    it('should not kick member if not party leader', () => {
        party_common_1.createParty(built_1.browser);
        party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
        party_common_1.changeLeader(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME3);
        built_1.browser.executeScript(`socket.emit("kick_from_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot kick - must be party leader");
        party_common_1.leaveParty(built_1.browser);
        party_common_1.leaveParty(common_1.browser3.instance);
    });
    it('should not kick member if other character not in party', () => {
        party_common_1.createParty(built_1.browser);
        built_1.browser.executeScript(`socket.emit("kick_from_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot kick - character not in party");
        party_common_1.leaveParty(built_1.browser);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ljay5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkva2ljay5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpREFBaUc7QUFDakcsc0NBQWlEO0FBQ2pELDRDQUEyQztBQUMzQyxvRUFBZ0Y7QUFFaEYsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQ3hCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtRQUN4QywwQkFBVyxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3JCLHdCQUFTLENBQUMsZUFBTyxFQUFFLGlCQUFRLENBQUMsUUFBUSxFQUFFLGlDQUFjLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQ3ZFLDRCQUFhLENBQUMsZUFBTyxFQUFFLGlCQUFRLENBQUMsUUFBUSxFQUFFLGtDQUFlLENBQUMsQ0FBQztRQUMzRCx5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQ3pDLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQzVGLG1CQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtRQUM3QywwQkFBVyxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3JCLHdCQUFTLENBQUMsZUFBTyxFQUFFLGlCQUFRLENBQUMsUUFBUSxFQUFFLGlDQUFjLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQ3ZFLDJCQUFZLENBQUMsZUFBTyxFQUFFLGlCQUFRLENBQUMsUUFBUSxFQUFFLGtDQUFlLENBQUMsQ0FBQztRQUMxRCxlQUFPLENBQUMsYUFBYSxDQUFDLCtDQUErQyxrQ0FBZSxNQUFNLENBQUMsQ0FBQztRQUM1RixtQkFBVSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDakQseUJBQVUsQ0FBQyxlQUFPLENBQUMsQ0FBQztRQUNwQix5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7UUFDekQsMEJBQVcsQ0FBQyxlQUFPLENBQUMsQ0FBQztRQUNyQixlQUFPLENBQUMsYUFBYSxDQUFDLCtDQUErQyxrQ0FBZSxNQUFNLENBQUMsQ0FBQztRQUM1RixtQkFBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDbkQseUJBQVUsQ0FBQyxlQUFPLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=