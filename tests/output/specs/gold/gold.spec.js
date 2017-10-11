Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const items_common_1 = require("../items/items.common");
const party_common_1 = require("../party/party.common");
const character_common_1 = require("../character/character.common");
describe('gold', () => {
    afterAll(() => common_1.clearLogs(common_1.newBrowser.instance));
    describe('pick', () => {
        it('should tell me how much gold i picked', () => {
            built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
            items_common_1.getItemId().then(itemId => {
                common_1.clearLogs();
                built_1.browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`);
                common_1.expectText(`"amount": 5`);
            });
        });
        it('should share gold equally among all party members in room', () => {
            party_common_1.createParty();
            party_common_1.joinParty(built_1.browser, common_1.newBrowser.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME2);
            party_common_1.joinParty(built_1.browser, common_1.browser3.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME3);
            built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 10});`);
            items_common_1.getItemId().then(itemId => {
                common_1.clearLogs();
                built_1.browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`);
                common_1.expectText(`"amount": 5`);
                party_common_1.leaveParty();
                party_common_1.leaveParty(common_1.newBrowser.instance);
                party_common_1.leaveParty(common_1.browser3.instance);
                common_1.newBrowser.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
                common_1.expectText(`"amount": -5`, common_1.newBrowser.instance);
                items_common_1.pickItem();
            });
        });
    });
    describe('drop', () => {
        describe('error', () => {
            it('should not allow to drop gold if didnt specify the amount', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {});`);
                common_1.expectText(`"Must mention what gold amount to throw"`);
            });
            it('should not allow to drop gold if amount to drop is negative', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: -1});`);
                common_1.expectText(`"Must mention what gold amount to throw"`);
            });
            it('should not allow to drop gold if amount to drop is zero', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 0});`);
                common_1.expectText(`"Must mention what gold amount to throw"`);
            });
            it('should not allow to drop gold if character has zero gold', () => {
                common_1.browser3.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
                common_1.expectText(`"Character does not have gold to throw!"`, common_1.browser3.instance);
            });
        });
        describe('success', () => {
            afterEach(() => items_common_1.pickItem());
            it('should tell about the gold change', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
                common_1.expectText(`"change_gold_amount"`, built_1.browser, false);
            });
            it('should take the character value if the character has less than what wanted to throw', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 50});`);
                common_1.expectText(`"amount": -20`, built_1.browser, false);
            });
            it('should tell about the item drop', () => {
                built_1.browser.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
                common_1.expectText(`"drop_items"`, built_1.browser, false);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZ29sZC9nb2xkLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBd0U7QUFDeEUsd0RBQTREO0FBQzVELHdEQUEyRTtBQUMzRSxvRUFBaUc7QUFFakcsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDbEIsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFTLENBQUMsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRS9DLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsZUFBTyxDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO1lBQ2xFLHdCQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RCLGtCQUFTLEVBQUUsQ0FBQztnQkFDWixlQUFPLENBQUMsYUFBYSxDQUFDLHlDQUF5QyxNQUFNLE1BQU0sQ0FBQyxDQUFBO2dCQUM1RSxtQkFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO1lBQ2pFLDBCQUFXLEVBQUUsQ0FBQztZQUNkLHdCQUFTLENBQUMsZUFBTyxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLGlDQUFjLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1lBQ3pFLHdCQUFTLENBQUMsZUFBTyxFQUFFLGlCQUFRLENBQUMsUUFBUSxFQUFFLGlDQUFjLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1lBQ3ZFLGVBQU8sQ0FBQyxhQUFhLENBQUMsNENBQTRDLENBQUMsQ0FBQTtZQUNuRSx3QkFBUyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FB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