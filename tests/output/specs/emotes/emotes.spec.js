Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
describe('emote', () => {
    beforeAll(() => built_1.browser.executeScript(`socket.emit("emoted", {});`));
    it('should tell the other characters about the emote', () => {
        common_1.expectText(`"actor_emote"`, common_1.newBrowser.instance);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vdGVzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9lbW90ZXMvZW1vdGVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBbUQ7QUFFbkQsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNkLFNBQVMsQ0FBQyxNQUFNLGVBQU8sQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO0lBRXJFLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtRQUNuRCxtQkFBVSxDQUFDLGVBQWUsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==