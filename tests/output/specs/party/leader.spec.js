Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
describe('switch party leader', () => {
    it('should switch party leader successfully', () => {
        party_common_1.createParty(built_1.browser);
        party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
        party_common_1.changeLeader(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME3);
        party_common_1.leaveParty(built_1.browser);
        party_common_1.leaveParty(common_1.browser3.instance);
    });
    it('should not switch lead if not in party', () => {
        built_1.browser.executeScript(`socket.emit("change_party_leader", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot switch lead - must be in a party");
    });
    it('should not switch lead if not party leader', () => {
        party_common_1.createParty(built_1.browser);
        party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
        party_common_1.changeLeader(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME3);
        built_1.browser.executeScript(`socket.emit("change_party_leader", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot switch lead - must be party leader");
        party_common_1.leaveParty(built_1.browser);
        party_common_1.leaveParty(common_1.browser3.instance);
    });
    it('should not switch lead if other character not in party', () => {
        party_common_1.createParty(built_1.browser);
        built_1.browser.executeScript(`socket.emit("change_party_leader", {char_name: "${character_common_1.TEST_CHAR_NAME3}"});`);
        common_1.expectText("Cannot switch lead - character not in party");
        party_common_1.leaveParty(built_1.browser);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9wYXJ0eS9sZWFkZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaURBQWtGO0FBQ2xGLHNDQUFpRDtBQUNqRCw0Q0FBMkM7QUFDM0Msb0VBQWdGO0FBRWhGLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM1QixFQUFFLENBQUMseUNBQXlDLEVBQUU7UUFDMUMsMEJBQVcsQ0FBQyxlQUFPLENBQUMsQ0FBQztRQUNyQix3QkFBUyxDQUFDLGVBQU8sRUFBRSxpQkFBUSxDQUFDLFFBQVEsRUFBRSxpQ0FBYyxFQUFFLGtDQUFlLENBQUMsQ0FBQztRQUN2RSwyQkFBWSxDQUFDLGVBQU8sRUFBRSxpQkFBUSxDQUFDLFFBQVEsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDMUQseUJBQVUsQ0FBQyxlQUFPLENBQUMsQ0FBQztRQUNwQix5QkFBVSxDQUFDLGlCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDekMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtREFBbUQsa0NBQWUsTUFBTSxDQUFDLENBQUM7UUFDaEcsbUJBQVUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1FBQzdDLDBCQUFXLENBQUMsZUFBTyxDQUFDLENBQUM7UUFDckIsd0JBQVMsQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsaUNBQWMsRUFBRSxrQ0FBZSxDQUFDLENBQUM7UUFDdkUsMkJBQVksQ0FBQyxlQUFPLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQzFELGVBQU8sQ0FBQyxhQUFhLENBQUMsbURBQW1ELGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ2hHLG1CQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUN4RCx5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3BCLHlCQUFVLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtRQUN6RCwwQkFBVyxDQUFDLGVBQU8sQ0FBQyxDQUFDO1FBQ3JCLGVBQU8sQ0FBQyxhQUFhLENBQUMsbURBQW1ELGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1FBQ2hHLG1CQUFVLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUMxRCx5QkFBVSxDQUFDLGVBQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==