Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const built_1 = require("protractor/built");
const common_1 = require("../common");
const character_common_1 = require("../character/character.common");
describe('invite to party', () => {
    it('should invite successfully', () => {
        party_common_1.createParty();
        party_common_1.inviteToParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME3);
        party_common_1.leaveParty();
    });
    it('should not invite if not in party', () => {
        built_1.browser.executeScript(`socket.emit("invite_to_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot invite - must be in a party");
    });
    it('should not let inviting if not party leader', () => {
        party_common_1.createParty(common_1.newBrowser.instance);
        party_common_1.joinParty(common_1.newBrowser.instance, built_1.browser, character_common_1.TEST_CHAR_NAME2, character_common_1.TEST_CHAR_NAME);
        built_1.browser.executeScript(`socket.emit("invite_to_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot invite - must be party leader");
        party_common_1.leaveParty(common_1.newBrowser.instance);
        party_common_1.leaveParty(built_1.browser);
    });
    it('should not let inviting if other character is offline', () => {
        party_common_1.createParty();
        built_1.browser.executeScript(`socket.emit("invite_to_party", {char_name: "random-name-that-is-actually-too-long-to-be-real"});`);
        common_1.expectText("Cannot invite - invitee is logged off");
        party_common_1.leaveParty();
    });
    it('should not let inviting if other character is already in party', () => {
        party_common_1.createParty();
        party_common_1.createParty(common_1.browser3.instance);
        built_1.browser.executeScript(`socket.emit("invite_to_party", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot invite - invitee is already in a party");
        party_common_1.leaveParty();
        party_common_1.leaveParty(common_1.browser3.instance);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9wYXJ0eS9pbnZpdGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaURBQW1GO0FBQ25GLDRDQUEyQztBQUMzQyxzQ0FBNkQ7QUFDN0Qsb0VBQWlHO0FBRWpHLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUN4QixFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDN0IsMEJBQVcsRUFBRSxDQUFDO1FBQ2QsNEJBQWEsQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQzNELHlCQUFVLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtRQUNwQyxlQUFPLENBQUMsYUFBYSxDQUFDLCtDQUErQyxrQ0FBZSxNQUFNLENBQUMsQ0FBQztRQUM1RixtQkFBVSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7UUFDOUMsMEJBQVcsQ0FBQyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLHdCQUFTLENBQUMsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsZUFBTyxFQUFFLGtDQUFlLEVBQUUsaUNBQWMsQ0FBQyxDQUFDO1FBQ3pFLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQzVGLG1CQUFVLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNuRCx5QkFBVSxDQUFDLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMseUJBQVUsQ0FBQyxlQUFPLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQU1ILEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtRQUN4RCwwQkFBVyxFQUFFLENBQUM7UUFDZCxlQUFPLENBQUMsYUFBYSxDQUFDLGtHQUFrRyxDQUFDLENBQUM7UUFDMUgsbUJBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3BELHlCQUFVLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtRQUNqRSwwQkFBVyxFQUFFLENBQUM7UUFDZCwwQkFBVyxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsZUFBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0Msa0NBQWUsTUFBTSxDQUFDLENBQUM7UUFDNUYsbUJBQVUsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQzVELHlCQUFVLEVBQUUsQ0FBQztRQUNiLHlCQUFVLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=