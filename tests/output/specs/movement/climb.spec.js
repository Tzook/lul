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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpbWIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL21vdmVtZW50L2NsaW1iLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUE4RDtBQUM5RCw0Q0FBMkM7QUFDM0Msb0VBQTZEO0FBRTdELFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDZCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDekIsU0FBUyxDQUFDO1lBQ04sZUFBTyxDQUFDLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLE1BQU0sa0JBQVMsRUFBRSxDQUFDLENBQUM7UUFFNUIsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO1lBQ3JFLG1CQUFVLENBQUMsd0JBQXdCLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFDakIsbUJBQVUsQ0FBQyxVQUFVLCtCQUFZLEdBQUcsRUFBRSxtQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQ3pCLFNBQVMsQ0FBQztZQUNOLGVBQU8sQ0FBQyxhQUFhLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxNQUFNLGtCQUFTLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxvRUFBb0UsRUFBRTtZQUNyRSxtQkFBVSxDQUFDLHVCQUF1QixFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ2pCLG1CQUFVLENBQUMsVUFBVSwrQkFBWSxHQUFHLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=