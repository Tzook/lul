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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZ29sZC9nb2xkLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBd0U7QUFDeEUsd0RBQTREO0FBQzVELHdEQUEyRTtBQUMzRSxvRUFBaUc7QUFFakcsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNiLFFBQVEsQ0FBQyxNQUFNLGtCQUFTLENBQUMsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRS9DLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDYixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDeEMsZUFBTyxDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO1lBQ2xFLHdCQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDbkIsa0JBQVMsRUFBRSxDQUFDO2dCQUNaLGVBQU8sQ0FBQyxhQUFhLENBQUMseUNBQXlDLE1BQU0sTUFBTSxDQUFDLENBQUE7Z0JBQzVFLG1CQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM1RCwwQkFBVyxFQUFFLENBQUM7WUFDZCx3QkFBUyxDQUFDLGVBQU8sRUFBRSxtQkFBVSxDQUFDLFFBQVEsRUFBRSxpQ0FBYyxFQUFFLGtDQUFlLENBQUMsQ0FBQztZQUN6RSx3QkFBUyxDQUFDLGVBQU8sRUFBRSxpQkFBUSxDQUFDLFFBQVEsRUFBRSxpQ0FBYyxFQUFFLGtDQUFlLENBQUMsQ0FBQztZQUN2RSxlQUFPLENBQUMsYUFBYSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7WUFDbkUsd0JBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUNuQixrQkFBUyxFQUFFLENBQUM7Z0JBQ1osZUFBTyxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsTUFBTSxNQUFN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