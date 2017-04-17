Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
describe('movement', () => {
    describe('update other character position', () => {
        let x = ((Math.random() * 100) | 0) / 100;
        beforeAll(() => {
            built_1.browser.executeScript(`socket.emit("movement", {x: "${x}", y: "2.2", z: "-1", angle: "45"});`);
        });
        afterAll(() => common_1.clearLogs());
        it('should pass movement', () => {
            common_1.expectText(`"movement"`, common_1.newBrowser.instance, false);
        });
        it('should pass id', () => {
            common_1.expectText(`"id": "${character_common_1.TEST_CHAR_ID}"`, common_1.newBrowser.instance, false);
        });
        it('should pass x', () => {
            common_1.expectText(`"x": "${x}"`, common_1.newBrowser.instance, false);
        });
        it('should pass y', () => {
            common_1.expectText(`"y": "2.2"`, common_1.newBrowser.instance, false);
        });
        it('should pass z', () => {
            common_1.expectText(`"z": "-1"`, common_1.newBrowser.instance, false);
        });
        it('should pass angle', () => {
            common_1.expectText(`"angle": "45"`, common_1.newBrowser.instance, false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL21vdmVtZW50L21vdmVtZW50LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUE4RDtBQUM5RCw0Q0FBMkM7QUFDM0Msb0VBQTZEO0FBRTdELFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDakIsUUFBUSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRTFDLFNBQVMsQ0FBQztZQUNOLGVBQU8sQ0FBQyxhQUFhLENBQUMsZ0NBQWdDLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxNQUFNLGtCQUFTLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN2QixtQkFBVSxDQUFDLFlBQVksRUFBRSxtQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNqQixtQkFBVSxDQUFDLFVBQVUsK0JBQVksR0FBRyxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLGVBQWUsRUFBRTtZQUNoQixtQkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsZUFBZSxFQUFFO1lBQ2hCLG1CQUFVLENBQUMsWUFBWSxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLGVBQWUsRUFBRTtZQUNoQixtQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtZQUNwQixtQkFBVSxDQUFDLGVBQWUsRUFBRSxtQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==