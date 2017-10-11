Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const equips_common_1 = require("./equips.common");
const items_common_1 = require("../items/items.common");
describe('drop equip', () => {
    beforeAll(equips_common_1.wearEquip);
    describe('errors', () => {
        describe('invalid slot', () => {
            afterEach(() => {
                common_1.expectText("Invalid slot!");
            });
            it('should tell if slot is not a valid equip slot', () => {
                built_1.browser.executeScript(`socket.emit("dropped_equip", {slot: "panties"});`);
            });
            it('should tell if slot has no equip', () => {
                built_1.browser.executeScript(`socket.emit("dropped_equip", {slot: "head"});`);
            });
        });
    });
    describe('drop successfully', () => {
        beforeAll(() => equips_common_1.dropEquip(false));
        afterAll(items_common_1.pickItem);
        it('should tell about the event to the other actor', () => {
            common_1.expectText("actor_delete_equip", common_1.newBrowser.instance);
        });
        it('should tell about the drop', () => {
            common_1.expectText("drop_items", built_1.browser, false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZXF1aXBzL2Ryb3Auc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQW1EO0FBQ25ELDRDQUEyQztBQUMzQyxtREFBdUQ7QUFDdkQsd0RBQWlEO0FBRWpELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLFNBQVMsQ0FBQyx5QkFBUyxDQUFDLENBQUM7SUFFckIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDcEIsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7WUFDMUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDWCxtQkFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtnQkFDckQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtnQkFDeEMsZUFBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsQyxRQUFRLENBQUMsdUJBQVEsQ0FBQyxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDdEQsbUJBQVUsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtZQUNsQyxtQkFBVSxDQUFDLFlBQVksRUFBRSxlQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=