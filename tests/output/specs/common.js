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
exports.browser3 = {};
function raiseNewBrowser(b, username) {
    beforeAll(() => b.instance = built_1.browser.forkNewDriverInstance());
    raiseBrowser(b, username);
}
function raiseBrowser2() {
    raiseNewBrowser(exports.newBrowser, user_common_1.TEST_USERNAME2);
}
exports.raiseBrowser2 = raiseBrowser2;
function raiseBrowser3() {
    raiseNewBrowser(exports.browser3, user_common_1.TEST_USERNAME3);
}
exports.raiseBrowser3 = raiseBrowser3;
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
        connectChar(exports.browser3.instance);
    });
}
exports.connectChars = connectChars;
function getChat(b = built_1.browser) {
    return b.$("#chat").getText();
}
exports.getChat = getChat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBOEQ7QUFDOUQsb0RBQTJFO0FBRTNFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztBQUVyQyxzQkFBNkIsQ0FBQyxHQUFHLEVBQUMsUUFBUSxFQUFFLGVBQU8sRUFBQyxFQUFFLFFBQVEsR0FBRyxTQUFTO0lBQ3RFLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDWCxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEQsbUJBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVBELG9DQU9DO0FBQUEsQ0FBQztBQUVXLFFBQUEsVUFBVSxHQUFtQyxFQUFFLENBQUM7QUFDaEQsUUFBQSxRQUFRLEdBQW1DLEVBQUUsQ0FBQztBQUUzRCx5QkFBeUIsQ0FBQyxFQUFFLFFBQVE7SUFFaEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsZUFBTyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztJQUM5RCxZQUFZLENBQUMsQ0FBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRDtJQUNJLGVBQWUsQ0FBQyxrQkFBVSxFQUFFLDRCQUFjLENBQUMsQ0FBQTtBQUMvQyxDQUFDO0FBRkQsc0NBRUM7QUFFRDtJQUNJLGVBQWUsQ0FBQyxnQkFBUSxFQUFFLDRCQUFjLENBQUMsQ0FBQTtBQUM3QyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxtQkFBMEIsQ0FBQyxHQUFHLGVBQU87SUFDakMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw4QkFFQztBQUVELG9CQUEyQixJQUFJLEVBQUUsQ0FBQyxHQUFHLGVBQU8sRUFBRSxLQUFLLEdBQUcsSUFBSTtJQUN0RCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JGLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUhELGdDQUdDO0FBRUQscUJBQTRCLENBQUMsR0FBRyxlQUFPO0lBSW5DLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0IsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBTkQsa0NBTUM7QUFFRDtJQUNJLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDWCxXQUFXLEVBQUUsQ0FBQztRQUNkLFdBQVcsQ0FBQyxrQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxnQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQU5ELG9DQU1DO0FBRUQsaUJBQXdCLENBQUMsR0FBRyxlQUFPO0lBQy9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLENBQUM7QUFGRCwwQkFFQyJ9