Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
describe('change ability', () => {
    it('should not to change ability if ability name was not provided', () => {
        built_1.browser.executeScript(`socket.emit("changed_ability", {});`);
        common_1.expectText(`"Must send what ability to use"`);
    });
    it('should not to change ability if ability is not included in the abilities list', () => {
        built_1.browser.executeScript(`socket.emit("changed_ability", {ability: "monkey"});`);
        common_1.expectText(`"Character cannot change to this ability"`);
    });
    it('should not allow to change ability if its the same ability', () => {
        built_1.browser.executeScript(`socket.emit("changed_ability", {ability: "melee"});`);
        common_1.expectText(`"Character already has this ability"`);
    });
    it('should change ability and notify other characters if can', () => {
        built_1.browser.executeScript(`socket.emit("changed_ability", {ability: "range"});`);
        common_1.expectText(`"actor_change_ability"`, common_1.newBrowser.instance);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJpbGl0eS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvY29tYmF0L2FiaWxpdHkuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTJDO0FBQzNDLHNDQUFtRDtBQUVuRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzVCLEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDckUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1FBQzVELG1CQUFVLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywrRUFBK0UsRUFBRSxHQUFHLEVBQUU7UUFDckYsZUFBTyxDQUFDLGFBQWEsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1FBQzdFLG1CQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDbEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxREFBcUQsQ0FBQyxDQUFBO1FBQzVFLG1CQUFVLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDaEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyxxREFBcUQsQ0FBQyxDQUFBO1FBQzVFLG1CQUFVLENBQUMsd0JBQXdCLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=