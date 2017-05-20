Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const equips_common_1 = require("./equips.common");
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
        beforeAll(equips_common_1.wearEquip);
        afterAll(equips_common_1.unwearEquip);
        it('should tell about the event to the other actor', () => {
            common_1.expectText("actor_equip_item", common_1.newBrowser.instance);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vhci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvZXF1aXBzL3dlYXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQW1EO0FBQ25ELDRDQUEyQztBQUMzQyxtREFBeUQ7QUFFekQsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNuQixRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2YsUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUN0QixTQUFTLENBQUM7Z0JBQ04sbUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO2dCQUM5QyxlQUFPLENBQUMsYUFBYSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7Z0JBQ3JELGVBQU8sQ0FBQyxhQUFhLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtnQkFDaEUsZUFBTyxDQUFDLGFBQWEsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1lBQ3JGLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO2dCQUM3RCxlQUFPLENBQUMsYUFBYSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUMxQixTQUFTLENBQUM7Z0JBQ04sbUJBQVUsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO2dCQUM5RCxlQUFPLENBQUMsYUFBYSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDbEYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7Z0JBQy9ELGVBQU8sQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDM0IsU0FBUyxDQUFDLHlCQUFTLENBQUMsQ0FBQztRQUNyQixRQUFRLENBQUMsMkJBQVcsQ0FBQyxDQUFDO1FBRXRCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNqRCxtQkFBVSxDQUFDLGtCQUFrQixFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=