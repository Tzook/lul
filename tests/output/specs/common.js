Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const user_common_1 = require("./user/user.common");
const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';
function raiseBrowser(b = { instance: built_1.browser }, username = undefined) {
    beforeAll(() => {
        b.instance.waitForAngularEnabled(false);
        b.instance.get(URL);
        b.instance.executeScript('window.test = true;');
        user_common_1.login(username, b.instance);
    });
}
exports.raiseBrowser = raiseBrowser;
;
exports.newBrowser = {};
function raiseBrowser2() {
    beforeAll(() => exports.newBrowser.instance = built_1.browser.forkNewDriverInstance());
    raiseBrowser(exports.newBrowser, user_common_1.TEST_USERNAME2);
}
exports.raiseBrowser2 = raiseBrowser2;
function clearLogs(b = built_1.browser) {
    b.executeScript(`clearResults();`);
}
exports.clearLogs = clearLogs;
function expectText(text, b = built_1.browser, clear = true) {
    b.wait(b.ExpectedConditions.textToBePresentInElement(b.$("#chat"), text), WAIT_TIME);
    clear && clearLogs(b);
}
exports.expectText = expectText;
function connectChar(b = built_1.browser) {
    b.executeScript(`connect(0);`);
    expectText(`"connected."`, b);
}
exports.connectChar = connectChar;
function connectChars() {
    beforeAll(() => {
        connectChar();
        connectChar(exports.newBrowser.instance);
    });
}
exports.connectChars = connectChars;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBOEQ7QUFDOUQsb0RBQTJEO0FBRTNELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztBQUVyQyxzQkFBNkIsQ0FBQyxHQUFHLEVBQUMsUUFBUSxFQUFFLGVBQU8sRUFBQyxFQUFFLFFBQVEsR0FBRyxTQUFTO0lBQ3RFLFNBQVMsQ0FBQztRQUNOLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNoRCxtQkFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBUEQsb0NBT0M7QUFBQSxDQUFDO0FBRVcsUUFBQSxVQUFVLEdBQW1DLEVBQUUsQ0FBQztBQUU3RDtJQUVJLFNBQVMsQ0FBQyxNQUFNLGtCQUFVLENBQUMsUUFBUSxHQUFHLGVBQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7SUFDdkUsWUFBWSxDQUFDLGtCQUFpQixFQUFFLDRCQUFjLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBSkQsc0NBSUM7QUFFRCxtQkFBMEIsQ0FBQyxHQUFHLGVBQU87SUFDakMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw4QkFFQztBQUVELG9CQUEyQixJQUFJLEVBQUUsQ0FBQyxHQUFHLGVBQU8sRUFBRSxLQUFLLEdBQUcsSUFBSTtJQUN0RCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JGLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUhELGdDQUdDO0FBRUQscUJBQTRCLENBQUMsR0FBRyxlQUFPO0lBSW5DLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0IsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBTkQsa0NBTUM7QUFFRDtJQUNJLFNBQVMsQ0FBQztRQUNOLFdBQVcsRUFBRSxDQUFDO1FBQ2QsV0FBVyxDQUFDLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsb0NBS0MifQ==