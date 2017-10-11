Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
const party_common_1 = require("../party/party.common");
describe('chatting', () => {
    describe('shout', () => {
        beforeAll(() => built_1.browser.executeScript(`socket.emit("shouted", {msg: "hi"});`));
        it('should tell the other characters about the shout', () => {
            common_1.expectText(`"shout"`, common_1.newBrowser.instance);
        });
    });
    describe('chat', () => {
        beforeAll(() => built_1.browser.executeScript(`socket.emit("chatted", {msg: "hi"});`));
        it('should tell the other characters about the shout', () => {
            common_1.expectText(`"chat"`, common_1.newBrowser.instance);
        });
    });
    describe('whisper', () => {
        it('should send an error when other character does not exist', () => {
            built_1.browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "123"});`);
            common_1.expectText(`"Failed to find socket for whisper"`);
        });
        it('should allow to whisper others by name', () => {
            built_1.browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${character_common_1.TEST_CHAR_NAME2}"});`);
            common_1.expectText(`"whisper"`, common_1.newBrowser.instance);
        });
        it('should allow to whisper oneself', () => {
            built_1.browser.executeScript(`socket.emit("whispered", {msg: "hi", to: "${character_common_1.TEST_CHAR_NAME}"});`);
            common_1.expectText(`"whisper"`);
        });
    });
    describe('party_chat', () => {
        beforeAll(() => {
            party_common_1.createParty(built_1.browser);
            party_common_1.joinParty(built_1.browser, common_1.newBrowser.instance, character_common_1.TEST_CHAR_NAME, character_common_1.TEST_CHAR_NAME2);
        });
        it('should communicate through party chat from leader', () => {
            built_1.browser.executeScript(`socket.emit("party_chatted", {msg: "hi party"});`);
            common_1.expectText(`"hi party"`, common_1.newBrowser.instance);
        });
        it('should communicate through party chat from member', () => {
            common_1.newBrowser.instance.executeScript(`socket.emit("party_chatted", {msg: "hi party2"});`);
            common_1.expectText(`"hi party2"`, built_1.browser);
        });
        it('should throw error if char have no party', () => {
            party_common_1.leaveParty(built_1.browser);
            party_common_1.leaveParty(common_1.newBrowser.instance);
            built_1.browser.executeScript(`socket.emit("party_chatted", {msg: "hi party"});`);
            common_1.expectText(`"Failed to find party for engaging in party chat"`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvY2hhdC9jaGF0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFtRDtBQUNuRCw0Q0FBMkM7QUFDM0Msb0VBQWdGO0FBQ2hGLHdEQUEyRTtBQUUzRSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN0QixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNuQixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUM7UUFFL0UsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUN4RCxtQkFBVSxDQUFDLFNBQVMsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNsQixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUM7UUFFL0UsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUN4RCxtQkFBVSxDQUFDLFFBQVEsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUNyQixFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLGVBQU8sQ0FBQyxhQUFhLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUMzRSxtQkFBVSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLGVBQU8sQ0FBQyxhQUFhLENBQUMsNkNBQTZDLGtDQUFlLE1BQU0sQ0FBQyxDQUFDO1lBQzFGLG1CQUFVLENBQUMsV0FBVyxFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLGVBQU8sQ0FBQyxhQUFhLENBQUMsNkNBQTZDLGlDQUFjLE1BQU0sQ0FBQyxDQUFDO1lBQ3pGLG1CQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDWCwwQkFBVyxDQUFDLGVBQU8sQ0FBQyxDQUFDO1lBQ3JCLHdCQUFTLENBQUMsZUFBTyxFQUFFLG1CQUFVLENBQUMsUUFBUSxFQUFFLGlDQUFjLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUN6RCxlQUFPLENBQUMsYUFBYSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7WUFDMUUsbUJBQVUsQ0FBQyxZQUFZLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDekQsbUJBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDdkYsbUJBQVUsQ0FBQyxhQUFhLEVBQUUsZUFBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2hELHlCQUFVLENBQUMsZUFBTyxDQUFDLENBQUM7WUFDcEIseUJBQVUsQ0FBQyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLGVBQU8sQ0FBQyxhQUFhLENBQUMsa0RBQWtELENBQUMsQ0FBQztZQUMxRSxtQkFBVSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=