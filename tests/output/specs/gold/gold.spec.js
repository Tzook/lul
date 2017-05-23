Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
const items_common_1 = require("../items/items.common");
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
                common_1.newBrowser.instance.executeScript(`socket.emit("dropped_gold", {amount: 5});`);
                common_1.expectText(`"Character does not have gold to throw!"`, common_1.newBrowser.instance);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZ29sZC9nb2xkLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBOEQ7QUFDOUQsd0RBQTREO0FBRTVELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDYixRQUFRLENBQUMsTUFBTSxrQkFBUyxDQUFDLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUUvQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQ3hDLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtZQUNsRSx3QkFBUyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLGtCQUFTLEVBQUUsQ0FBQztnQkFDWixlQUFPLENBQUMsYUFBYSxDQUFDLHlDQUF5QyxNQUFNLE1BQU0sQ0FBQyxDQUFBO2dCQUM1RSxtQkFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDYixRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2QsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO2dCQUM1RCxlQUFPLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUE7Z0JBQ3pELG1CQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtnQkFDOUQsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO2dCQUNuRSxtQkFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7Z0JBQzFELGVBQU8sQ0FBQyxhQUFhLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtnQkFDbEUsbUJBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO2dCQUMzRCxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtnQkFDOUUsbUJBQVUsQ0FBQywwQ0FBMEMsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ2hCLFNBQVMsQ0FBQyxNQUFNLHVCQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDcEMsZUFBTyxDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO2dCQUNsRSxtQkFBVSxDQUFDLHNCQUFzQixFQUFFLGVBQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxRkFBcUYsRUFBRTtnQkFDdEYsZUFBTyxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO2dCQUNuRSxtQkFBVSxDQUFDLGVBQWUsRUFBRSxlQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ2xDLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtnQkFDbEUsbUJBQVUsQ0FBQyxjQUFjLEVBQUUsZUFBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=