Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const WAIT_TIME = 5000;
const URL = 'http://localhost:5000/';
function raiseBrowser() {
    beforeEach(() => {
        built_1.browser.ignoreSynchronization = true;
        built_1.browser.get(URL);
    });
}
exports.raiseBrowser = raiseBrowser;
;
function expectText(text) {
    built_1.browser.wait(built_1.ExpectedConditions.textToBePresentInElement(built_1.$("#chat"), text), WAIT_TIME);
}
exports.expectText = expectText;
function login() {
    built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
    expectText("Logged in successfully.");
}
exports.login = login;
function logout() {
    built_1.browser.executeScript(`logout()`);
    expectText("Logged out successfully.");
}
exports.logout = logout;
function deleteUser() {
    built_1.browser.executeScript(`deleteUser()`);
    expectText("User successfully deleted.");
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3BlY3MvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBa0U7QUFFbEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sR0FBRyxHQUFHLHdCQUF3QixDQUFDO0FBRXJDO0lBQ0ksVUFBVSxDQUFDO1FBQ1AsZUFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUxELG9DQUtDO0FBQUEsQ0FBQztBQUVGLG9CQUEyQixJQUFJO0lBQzNCLGVBQU8sQ0FBQyxJQUFJLENBQUMsMEJBQWtCLENBQUMsd0JBQXdCLENBQUMsU0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNGLENBQUM7QUFGRCxnQ0FFQztBQUVEO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0lBQ3BILFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFIRCxzQkFHQztBQUVEO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBSEQsd0JBR0M7QUFFRDtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUhELGdDQUdDIn0=