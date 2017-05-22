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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0YWNrLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9jb21iYXQvYXR0YWNrLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUEyQztBQUMzQyxzQ0FBbUQ7QUFFbkQsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNmLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDYixTQUFTLENBQUMsTUFBTSxlQUFPLENBQUMsYUFBYSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQztRQUU1RSxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDbEQsbUJBQVUsQ0FBQyxxQkFBcUIsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtZQUNwRCxlQUFPLENBQUMsYUFBYSxDQUFDLHNDQUFzQyxDQUFDLENBQUE7WUFDN0QsbUJBQVUsQ0FBQyx3QkFBd0IsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1lBQ3hCLGVBQU8sQ0FBQyxhQUFhLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtZQUN2RSxtQkFBVSxDQUFDLFlBQVksRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQzdDLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUMsQ0FBQTtZQUN0RSxtQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzNDLGVBQU8sQ0FBQyxhQUFhLENBQUMsOENBQThDLENBQUMsQ0FBQTtZQUNyRSxtQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9