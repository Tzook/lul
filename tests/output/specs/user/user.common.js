Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
exports.TEST_USERNAME = 'test';
exports.TEST_USERNAME2 = 'test2';
exports.TEST_USERNAME_UNCAUGHT = 'uncaughtTestName';
exports.TEST_PASSWORD = '12345678123456781234567812345678';
function login(username = exports.TEST_USERNAME, chosenBrowser = built_1.browser) {
    chosenBrowser.executeScript(`sendPost('/user/login', {username: '${username}', password: '${exports.TEST_PASSWORD}'});`);
    common_1.expectText("Logged in successfully.", chosenBrowser);
}
exports.login = login;
function logout(chosenBrowser = built_1.browser) {
    chosenBrowser.executeScript(`logout()`);
    common_1.expectText("Logged out successfully.");
}
exports.logout = logout;
function register(username = exports.TEST_USERNAME_UNCAUGHT) {
    built_1.browser.executeScript(`sendPost('/user/register', {username: '${username}', password: '${exports.TEST_PASSWORD}'});`);
    common_1.expectText("Registered and then logged in successfully.");
}
exports.register = register;
function deleteUser() {
    built_1.browser.executeScript(`deleteUser()`);
    common_1.expectText("User successfully deleted.");
}
exports.deleteUser = deleteUser;
function runAllTestsWithoutUser() {
    beforeAll(() => {
        logout();
    });
    afterAll(() => {
        login();
    });
}
exports.runAllTestsWithoutUser = runAllTestsWithoutUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3VzZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsNENBQTJDO0FBRTlCLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN2QixRQUFBLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDekIsUUFBQSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM1QyxRQUFBLGFBQWEsR0FBRyxrQ0FBa0MsQ0FBQztBQUVoRSxlQUFzQixRQUFRLEdBQUcscUJBQWEsRUFBRSxhQUFhLEdBQUcsZUFBTztJQUNuRSxhQUFhLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxRQUFRLGlCQUFpQixxQkFBYSxNQUFNLENBQUMsQ0FBQztJQUNqSCxtQkFBVSxDQUFDLHlCQUF5QixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFIRCxzQkFHQztBQUVELGdCQUF1QixhQUFhLEdBQUcsZUFBTztJQUMxQyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLG1CQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBSEQsd0JBR0M7QUFFRCxrQkFBeUIsUUFBUSxHQUFHLDhCQUFzQjtJQUN0RCxlQUFPLENBQUMsYUFBYSxDQUFDLDBDQUEwQyxRQUFRLGlCQUFpQixxQkFBYSxNQUFNLENBQUMsQ0FBQztJQUM5RyxtQkFBVSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUhELDRCQUdDO0FBRUQ7SUFDSSxlQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLG1CQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBSEQsZ0NBR0M7QUFFRDtJQUNJLFNBQVMsQ0FBQztRQUNOLE1BQU0sRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUM7UUFDTCxLQUFLLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVJELHdEQVFDIn0=