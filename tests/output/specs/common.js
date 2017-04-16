Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const user_common_1 = require("./user/user.common");
const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';
function raiseBrowser() {
    beforeAll(() => {
        built_1.browser.waitForAngularEnabled(false);
        built_1.browser.get(URL);
        built_1.browser.executeScript('window.test = true;');
        user_common_1.login();
    });
    afterEach(() => {
        built_1.browser.executeScript(`clearResults();`);
    });
}
exports.raiseBrowser = raiseBrowser;
;
function raiseBrowser2() {
    let newBrowser = {};
    beforeAll(() => {
        newBrowser.instance = built_1.browser.forkNewDriverInstance();
        newBrowser.instance.waitForAngularEnabled(false);
        newBrowser.instance.get(URL);
        newBrowser.instance.executeScript('window.test = true;');
        user_common_1.login(undefined, newBrowser.instance);
    });
    afterAll(done => newBrowser.instance.quit().then(() => done()));
    return newBrowser;
}
exports.raiseBrowser2 = raiseBrowser2;
function expectText(text, chosenBrowser = built_1.browser) {
    chosenBrowser.wait(chosenBrowser.ExpectedConditions.textToBePresentInElement(chosenBrowser.$("#chat"), text), WAIT_TIME);
}
exports.expectText = expectText;
function connectChar(charId, chosenBrowser = built_1.browser) {
    chosenBrowser.executeScript(`connect(${charId});`);
    expectText(`"connected."`, chosenBrowser);
}
exports.connectChar = connectChar;
function disconnect(chosenBrowser = built_1.browser) {
    chosenBrowser.executeScript(`disconnect();`);
    expectText(`"disconnected."`, chosenBrowser);
}
exports.disconnect = disconnect;
function connectChars(newBrowser) {
    beforeAll(() => {
        connectChar(0);
        connectChar(1, newBrowser.instance);
    });
    afterAll(() => {
        disconnect();
    });
}
exports.connectChars = connectChars;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBOEQ7QUFDOUQsb0RBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztBQUVyQztJQUNJLFNBQVMsQ0FBQztRQUNOLGVBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGVBQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM3QyxtQkFBSyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQztRQUNOLGVBQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFYRCxvQ0FXQztBQUFBLENBQUM7QUFFRjtJQUVJLElBQUksVUFBVSxHQUFtQyxFQUFFLENBQUM7SUFFcEQsU0FBUyxDQUFDO1FBQ04sVUFBVSxDQUFDLFFBQVEsR0FBRyxlQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxVQUFVLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDekQsbUJBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVoRSxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUFmRCxzQ0FlQztBQUVELG9CQUEyQixJQUFJLEVBQUUsYUFBYSxHQUFHLGVBQU87SUFDcEQsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3SCxDQUFDO0FBRkQsZ0NBRUM7QUFFRCxxQkFBNEIsTUFBTSxFQUFFLGFBQWEsR0FBRyxlQUFPO0lBTXZELGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ25ELFVBQVUsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQVJELGtDQVFDO0FBRUQsb0JBQTJCLGFBQWEsR0FBRyxlQUFPO0lBQzlDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0MsVUFBVSxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFIRCxnQ0FHQztBQUVELHNCQUE2QixVQUFVO0lBQ25DLFNBQVMsQ0FBQztRQUNOLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLFdBQVcsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDO1FBQ0wsVUFBVSxFQUFFLENBQUM7SUFFakIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBVkQsb0NBVUMifQ==