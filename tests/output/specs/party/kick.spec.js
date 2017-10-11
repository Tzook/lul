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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ljay5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkva2ljay5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpREFBaUc7QUFDakcsc0NBQWlEO0FBQ2pELDRDQUEyQztBQUMzQyxvRUFBZ0Y7QUFFaEYsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUM3QixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQzdDLDBCQUFXLENBQUMsZUFBTyxDQUFDLENBQUM7UUFDckIsd0JBQVMsQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsaUNBQWMsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDdkUsNEJBQWEsQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQzNELHlCQUFVLENBQUMsZUFBTyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1FBQzlDLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQzVGLG1CQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsMEJBQVcsQ0FBQyxlQUFPLENBQUMsQ0FBQztRQUNyQix3QkFBUyxDQUFDLGVBQU8sRUFBRSxpQkFBUSxDQUFDLFFBQVEsRUFBRSxpQ0FBYyxFQUFFLGtDQUFlLENBQUMsQ0FBQztRQUN2RSwyQkFBWSxDQUFDLGVBQU8sRUFBRSxpQkFBUSxDQUFDLFFBQVEsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDMUQsZUFBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0Msa0NBQWUsTUFBTSxDQUFDLENBQUM7UUFDNUYsbUJBQVUsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2pELHlCQUFVLENBQUMsZUFBTyxDQUFDLENBQUM7UUFDcEIseUJBQVUsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUM5RCwwQkFBVyxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3JCLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQzVGLG1CQUFVLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNuRCx5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==