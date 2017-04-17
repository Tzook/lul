Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const user_common_1 = require("./user/user.common");
const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';
function raiseBrowser(b = { instance: built_1.browser }) {
    beforeAll(() => {
        b.instance.waitForAngularEnabled(false);
        b.instance.get(URL);
        b.instance.executeScript('window.test = true;');
        user_common_1.login(undefined, b.instance);
    });
}
exports.raiseBrowser = raiseBrowser;
;
exports.newBrowser = {};
function raiseBrowser2() {
    beforeAll(() => exports.newBrowser.instance = built_1.browser.forkNewDriverInstance());
    raiseBrowser(exports.newBrowser);
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
function connectChar(charId, b = built_1.browser) {
    b.executeScript(`connect(${charId});`);
    expectText(`"connected."`, b);
}
exports.connectChar = connectChar;
function connectChars() {
    beforeAll(() => {
        connectChar(0);
        connectChar(1, exports.newBrowser.instance);
    });
}
exports.connectChars = connectChars;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBOEQ7QUFDOUQsb0RBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztBQUVyQyxzQkFBNkIsQ0FBQyxHQUFHLEVBQUMsUUFBUSxFQUFFLGVBQU8sRUFBQztJQUNoRCxTQUFTLENBQUM7UUFDTixDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEQsbUJBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVBELG9DQU9DO0FBQUEsQ0FBQztBQUVXLFFBQUEsVUFBVSxHQUFtQyxFQUFFLENBQUM7QUFFN0Q7SUFFSSxTQUFTLENBQUMsTUFBTSxrQkFBVSxDQUFDLFFBQVEsR0FBRyxlQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLFlBQVksQ0FBQyxrQkFBaUIsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFKRCxzQ0FJQztBQUVELG1CQUEwQixDQUFDLEdBQUcsZUFBTztJQUNqQyxDQUFDLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELDhCQUVDO0FBR0Qsb0JBQTJCLElBQUksRUFBRSxDQUFDLEdBQUcsZUFBTyxFQUFFLEtBQUssR0FBRyxJQUFJO0lBQ3RELENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckYsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBSEQsZ0NBR0M7QUFFRCxxQkFBNEIsTUFBTSxFQUFFLENBQUMsR0FBRyxlQUFPO0lBSTNDLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQU5ELGtDQU1DO0FBRUQ7SUFDSSxTQUFTLENBQUM7UUFDTixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixXQUFXLENBQUMsQ0FBQyxFQUFFLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsb0NBS0MifQ==