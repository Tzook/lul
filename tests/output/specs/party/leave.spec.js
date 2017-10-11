Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const built_1 = require("protractor/built");
const common_1 = require("../common");
const character_common_1 = require("../character/character.common");
describe('leave party', () => {
    it('should leave party successfully if in a party', () => {
        party_common_1.createParty();
        party_common_1.leaveParty();
    });
    it('should make someone else the leader if were leader', () => {
        party_common_1.createParty();
        party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
        party_common_1.leaveParty();
        common_1.expectText("actor_lead_party", common_1.browser3.instance);
        party_common_1.leaveParty(common_1.browser3.instance);
    });
    it('should not allow to leave party if not in a party', () => {
        built_1.browser.executeScript(`socket.emit("leave_party", {});`);
        common_1.expectText("Cannot leave - must be in a party");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL3BhcnR5L2xlYXZlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlEQUFvRTtBQUNwRSw0Q0FBMkM7QUFDM0Msc0NBQWlEO0FBQ2pELG9FQUFnRjtBQUVoRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUN6QixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELDBCQUFXLEVBQUUsQ0FBQztRQUNkLHlCQUFVLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsMEJBQVcsRUFBRSxDQUFDO1FBQ2Qsd0JBQVMsQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsaUNBQWMsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDdkUseUJBQVUsRUFBRSxDQUFDO1FBQ2IsbUJBQVUsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELHlCQUFVLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7UUFDekQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3pELG1CQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=