Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const user_common_1 = require("./user/user.common");
const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';
function raiseBrowser() {
    beforeAll(() => {
        built_1.browser.waitForAngularEnabled(false);
        built_1.browser.get(URL);
        user_common_1.login();
    });
    afterEach(() => {
        built_1.browser.executeScript(`clearResults();`);
    });
}
exports.raiseBrowser = raiseBrowser;
;
function expectText(text) {
    built_1.browser.wait(built_1.ExpectedConditions.textToBePresentInElement(built_1.$("#chat"), text), WAIT_TIME);
}
exports.expectText = expectText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBa0U7QUFDbEUsb0RBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztBQUVyQztJQUNJLFNBQVMsQ0FBQztRQUNOLGVBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLG1CQUFLLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDO1FBQ04sZUFBTyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVZELG9DQVVDO0FBQUEsQ0FBQztBQWlCRixvQkFBMkIsSUFBSTtJQUMzQixlQUFPLENBQUMsSUFBSSxDQUFDLDBCQUFrQixDQUFDLHdCQUF3QixDQUFDLFNBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRixDQUFDO0FBRkQsZ0NBRUMifQ==