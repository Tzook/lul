Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
describe('climb', () => {
    describe('started climbing', () => {
        beforeAll(() => {
            built_1.browser.executeScript(`socket.emit("started_climbing", {});`);
        });
        afterAll(() => common_1.clearLogs());
        it('should tell the other client that a character has started climbing', () => {
            common_1.expectText(`"actor_start_climbing"`, common_1.newBrowser.instance, false);
        });
        it('should pass id', () => {
            common_1.expectText(`"id": "${character_common_1.TEST_CHAR_ID}"`, common_1.newBrowser.instance, false);
        });
    });
    describe('stopped climbing', () => {
        beforeAll(() => {
            built_1.browser.executeScript(`socket.emit("stopped_climbing", {});`);
        });
        afterAll(() => common_1.clearLogs());
        it('should tell the other client that a character has started climbing', () => {
            common_1.expectText(`"actor_stop_climbing"`, common_1.newBrowser.instance, false);
        });
        it('should pass id', () => {
            common_1.expectText(`"id": "${character_common_1.TEST_CHAR_ID}"`, common_1.newBrowser.instance, false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpbWIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL21vdmVtZW50L2NsaW1iLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUE4RDtBQUM5RCw0Q0FBMkM7QUFDM0Msb0VBQTZEO0FBRTdELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNYLGVBQU8sQ0FBQyxhQUFhLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBUyxFQUFFLENBQUMsQ0FBQztRQUU1QixFQUFFLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1lBQzFFLG1CQUFVLENBQUMsd0JBQXdCLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1lBQ3RCLG1CQUFVLENBQUMsVUFBVSwrQkFBWSxHQUFHLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNYLGVBQU8sQ0FBQyxhQUFhLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBUyxFQUFFLENBQUMsQ0FBQztRQUU1QixFQUFFLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1lBQzFFLG1CQUFVLENBQUMsdUJBQXVCLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1lBQ3RCLG1CQUFVLENBQUMsVUFBVSwrQkFBWSxHQUFHLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=