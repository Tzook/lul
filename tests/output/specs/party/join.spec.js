Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
describe('join party', () => {
    it('should join a party invitation successfully', () => {
        party_common_1.createParty(common_1.browser3.instance);
        party_common_1.joinParty(common_1.browser3.instance, built_1.browser, character_common_1.TEST_CHAR_NAME3, character_common_1.TEST_CHAR_NAME);
        party_common_1.leaveParty(common_1.browser3.instance);
        party_common_1.leaveParty(built_1.browser);
    });
    it('should not let joining a party if already in party', () => {
        party_common_1.createParty();
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot join - already in party");
        party_common_1.leaveParty();
    });
    it('should not let joining a party if leader is not in a party', () => {
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot join - party is disbanded");
    });
    it('should not let joining a party if leader does not exist', () => {
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "a-name-that-does-not-exist"});`);
        common_1.expectText("Cannot join - party is disbanded");
    });
    it('should not let joining a party when you were not invited', () => {
        party_common_1.createParty(common_1.browser3.instance);
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot join - not invited anymore");
        party_common_1.leaveParty(common_1.browser3.instance);
    });
    it('should not let joining a party when you were invited by someone but he is not the leader anymore', () => {
        party_common_1.createParty(common_1.browser3.instance);
        party_common_1.joinParty(common_1.browser3.instance, common_1.newBrowser.instance, character_common_1.TEST_CHAR_NAME3, character_common_1.TEST_CHAR_NAME2);
        party_common_1.inviteToParty(common_1.browser3.instance, built_1.browser, character_common_1.TEST_CHAR_NAME);
        party_common_1.changeLeader(common_1.browser3.instance, common_1.newBrowser.instance, character_common_1.TEST_CHAR_NAME2);
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot join - party leader has changed");
        party_common_1.leaveParty(common_1.browser3.instance);
        party_common_1.leaveParty(common_1.newBrowser.instance);
    });
    it('should discard the invitation after joining once', () => {
        party_common_1.createParty(common_1.browser3.instance);
        party_common_1.joinParty(common_1.browser3.instance, built_1.browser, character_common_1.TEST_CHAR_NAME3, character_common_1.TEST_CHAR_NAME);
        party_common_1.leaveParty(built_1.browser);
        built_1.browser.executeScript(`socket.emit("join_party", {leader_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot join - not invited anymore");
        party_common_1.leaveParty(common_1.browser3.instance);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkvam9pbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpREFBaUc7QUFDakcsc0NBQTZEO0FBQzdELDRDQUEyQztBQUMzQyxvRUFBaUc7QUFFakcsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNuQixFQUFFLENBQUMsNkNBQTZDLEVBQUU7UUFDOUMsMEJBQVcsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLHdCQUFTLENBQUMsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBTyxFQUFFLGtDQUFlLEVBQUUsaUNBQWMsQ0FBQyxDQUFDO1FBQ3ZFLHlCQUFVLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5Qix5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO1FBQ3JELDBCQUFXLEVBQUUsQ0FBQztRQUNkLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUM3Qyx5QkFBVSxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUU7UUFDN0QsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsa0NBQWUsTUFBTSxDQUFDLENBQUM7UUFDekYsbUJBQVUsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1FBQzFELGVBQU8sQ0FBQyxhQUFhLENBQUMseUVBQXlFLENBQUMsQ0FBQztRQUNqRyxtQkFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7UUFDM0QsMEJBQVcsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNoRCx5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0dBQWtHLEVBQUU7UUFDbkcsMEJBQVcsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLHdCQUFTLENBQUMsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsa0NBQWUsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDcEYsNEJBQWEsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsRUFBRSxlQUFPLEVBQUUsaUNBQWMsQ0FBQyxDQUFDO1FBQzFELDJCQUFZLENBQUMsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQ3RFLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUNyRCx5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIseUJBQVUsQ0FBQyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1FBQ25ELDBCQUFXLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQix3QkFBUyxDQUFDLGlCQUFRLENBQUMsUUFBUSxFQUFFLGVBQU8sRUFBRSxrQ0FBZSxFQUFFLGlDQUFjLENBQUMsQ0FBQztRQUN2RSx5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3BCLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNoRCx5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9