Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
describe('attack', () => {
    describe('load', () => {
        beforeAll(() => built_1.browser.executeScript(`socket.emit("loaded_attack", {});`));
        it('should tell the other characters about the load', () => {
            common_1.expectText(`"actor_load_attack"`, common_1.newBrowser.instance);
        });
    });
    describe('perform', () => {
        it('should tell the other characters about the attack', () => {
            built_1.browser.executeScript(`socket.emit("performed_attack", {});`);
            common_1.expectText(`"actor_perform_attack"`, common_1.newBrowser.instance);
        });
        it('pass the rounded load', () => {
            built_1.browser.executeScript(`socket.emit("performed_attack", {load: 11.5});`);
            common_1.expectText(`"load": 11`, common_1.newBrowser.instance);
        });
        it('pass 0 load if value is above the max, 100', () => {
            built_1.browser.executeScript(`socket.emit("performed_attack", {load: 200});`);
            common_1.expectText(`"load": 0`, common_1.newBrowser.instance);
        });
        it('pass 0 load if value is below the min, 0', () => {
            built_1.browser.executeScript(`socket.emit("performed_attack", {load: -2});`);
            common_1.expectText(`"load": 0`, common_1.newBrowser.instance);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0YWNrLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jb21iYXQvYXR0YWNrLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBbUQ7QUFFbkQsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDcEIsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDbEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDO1FBRTVFLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7WUFDdkQsbUJBQVUsQ0FBQyxxQkFBcUIsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUNyQixFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQ3pELGVBQU8sQ0FBQyxhQUFhLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtZQUM3RCxtQkFBVSxDQUFDLHdCQUF3QixFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQzdCLGVBQU8sQ0FBQyxhQUFhLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtZQUN2RSxtQkFBVSxDQUFDLFlBQVksRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxlQUFPLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLENBQUE7WUFDdEUsbUJBQVUsQ0FBQyxXQUFXLEVBQUUsbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDaEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFBO1lBQ3JFLG1CQUFVLENBQUMsV0FBVyxFQUFFLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=