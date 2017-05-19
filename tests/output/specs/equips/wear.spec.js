Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
describe('wear equip', () => {
    describe('errors', () => {
        describe('invalid slots', () => {
            afterEach(() => {
                common_1.expectText("Invalid slots!");
            });
            it('should tell if got "from" slot lower than 0', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: -1, to: "legs"});`);
            });
            it('should tell if got "from" slot higher than the max', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: 35, to: "legs"});`);
            });
            it('should tell if got "to" slot to something that does not exist', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "panties"});`);
            });
            it('should tell if got "from" slot that does not have any item', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: 10, to: "legs"});`);
            });
        });
        describe('cannot wear equip', () => {
            afterEach(() => {
                common_1.expectText("Item cannot be equipped there");
            });
            it('should tell if the equip does not fit to the slot requested', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "head"});`);
            });
            it('should tell if the equip has a lvl requirement above the lvl', () => {
                built_1.browser.executeScript(`socket.emit("equipped_item", {from: 1, to: "weapon"});`);
            });
        });
    });
    describe('equip successfully', () => {
        beforeAll(() => {
            built_1.browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "legs"});`);
        });
        afterAll(() => {
            built_1.browser.executeScript(`socket.emit("unequipped_item", {from: "legs", to: 0});`);
            common_1.expectText("actor_unequip_item", built_1.browser);
        });
        it('should tell about the event to the actor', () => {
            common_1.expectText("actor_equip_item", built_1.browser);
        });
        it('should tell about the event to the other actor', () => {
            common_1.expectText("actor_equip_item", common_1.newBrowser.instance);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vhci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZXF1aXBzL3dlYXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQW1EO0FBQ25ELDRDQUEyQztBQUUzQyxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDZixRQUFRLENBQUMsZUFBZSxFQUFFO1lBQ3RCLFNBQVMsQ0FBQztnQkFDTixtQkFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7Z0JBQzlDLGVBQU8sQ0FBQyxhQUFhLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtnQkFDckQsZUFBTyxDQUFDLGFBQWEsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQ25GLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO2dCQUNoRSxlQUFPLENBQUMsYUFBYSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7WUFDckYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUU7Z0JBQzdELGVBQU8sQ0FBQyxhQUFhLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzFCLFNBQVMsQ0FBQztnQkFDTixtQkFBVSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7Z0JBQzlELGVBQU8sQ0FBQyxhQUFhLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtnQkFDL0QsZUFBTyxDQUFDLGFBQWEsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUMzQixTQUFTLENBQUM7WUFDTixlQUFPLENBQUMsYUFBYSxDQUFDLHNEQUFzRCxDQUFDLENBQUE7UUFDakYsQ0FBQyxDQUFDLENBQUM7UUFDSCxRQUFRLENBQUM7WUFDTCxlQUFPLENBQUMsYUFBYSxDQUFDLHdEQUF3RCxDQUFDLENBQUE7WUFDL0UsbUJBQVUsQ0FBQyxvQkFBb0IsRUFBRSxlQUFPLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUMzQyxtQkFBVSxDQUFDLGtCQUFrQixFQUFFLGVBQU8sQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ2pELG1CQUFVLENBQUMsa0JBQWtCLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==