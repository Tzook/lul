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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkvam9pbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpREFBaUc7QUFDakcsc0NBQTZEO0FBQzdELDRDQUEyQztBQUMzQyxvRUFBaUc7QUFFakcsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDeEIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtRQUNuRCwwQkFBVyxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0Isd0JBQVMsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsRUFBRSxlQUFPLEVBQUUsa0NBQWUsRUFBRSxpQ0FBYyxDQUFDLENBQUM7UUFDdkUseUJBQVUsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLHlCQUFVLENBQUMsZUFBTyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzFELDBCQUFXLEVBQUUsQ0FBQztRQUNkLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUM3Qyx5QkFBVSxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsZUFBTyxDQUFDLGFBQWEsQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1FBQ2pHLG1CQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDaEUsMEJBQVcsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNoRCx5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0dBQWtHLEVBQUUsR0FBRyxFQUFFO1FBQ3hHLDBCQUFXLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQix3QkFBUyxDQUFDLGlCQUFRLENBQUMsUUFBUSxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLGtDQUFlLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQ3BGLDRCQUFhLENBQUMsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBTyxFQUFFLGlDQUFjLENBQUMsQ0FBQztRQUMxRCwyQkFBWSxDQUFDLGlCQUFRLENBQUMsUUFBUSxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLGtDQUFlLENBQUMsQ0FBQztRQUN0RSxlQUFPLENBQUMsYUFBYSxDQUFDLDRDQUE0QyxrQ0FBZSxNQUFNLENBQUMsQ0FBQztRQUN6RixtQkFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDckQseUJBQVUsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLHlCQUFVLENBQUMsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDeEQsMEJBQVcsQ0FBQyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLHdCQUFTLENBQUMsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBTyxFQUFFLGtDQUFlLEVBQUUsaUNBQWMsQ0FBQyxDQUFDO1FBQ3ZFLHlCQUFVLENBQUMsZUFBTyxDQUFDLENBQUM7UUFDcEIsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsa0NBQWUsTUFBTSxDQUFDLENBQUM7UUFDekYsbUJBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hELHlCQUFVLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=