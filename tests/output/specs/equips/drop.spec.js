Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const equips_common_1 = require("./equips.common");
const items_common_1 = require("../items/items.common");
fdescribe('drop equip', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZXF1aXBzL2Ryb3Auc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQW1EO0FBQ25ELDRDQUEyQztBQUMzQyxtREFBdUQ7QUFDdkQsd0RBQWlEO0FBRWpELFNBQVMsQ0FBQyxZQUFZLEVBQUU7SUFDcEIsU0FBUyxDQUFDLHlCQUFTLENBQUMsQ0FBQztJQUVyQixRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2YsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUNyQixTQUFTLENBQUM7Z0JBQ04sbUJBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDaEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO2dCQUNuQyxlQUFPLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzFCLFNBQVMsQ0FBQyxNQUFNLHlCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsQyxRQUFRLENBQUMsdUJBQVEsQ0FBQyxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNqRCxtQkFBVSxDQUFDLG9CQUFvQixFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUU7WUFDN0IsbUJBQVUsQ0FBQyxZQUFZLEVBQUUsZUFBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9