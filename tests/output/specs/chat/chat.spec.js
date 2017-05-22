Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvY2hhdC9jaGF0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFtRDtBQUNuRCw0Q0FBMkM7QUFDM0Msb0VBQWdGO0FBRWhGLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDakIsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNkLFNBQVMsQ0FBQyxNQUFNLGVBQU8sQ0FBQyxhQUFhLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDO1FBRS9FLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNuRCxtQkFBVSxDQUFDLFNBQVMsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2IsU0FBUyxDQUFDLE1BQU0sZUFBTyxDQUFDLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUM7UUFFL0UsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ25ELG1CQUFVLENBQUMsUUFBUSxFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzNELGVBQU8sQ0FBQyxhQUFhLENBQUMsbURBQW1ELENBQUMsQ0FBQTtZQUMxRSxtQkFBVSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDekMsZUFBTyxDQUFDLGFBQWEsQ0FBQyw2Q0FBNkMsa0NBQWUsTUFBTSxDQUFDLENBQUE7WUFDekYsbUJBQVUsQ0FBQyxXQUFXLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNsQyxlQUFPLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxpQ0FBYyxNQUFNLENBQUMsQ0FBQTtZQUN4RixtQkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9