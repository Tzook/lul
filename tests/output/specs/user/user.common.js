Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
exports.TEST_USERNAME = 'test';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3VzZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsNENBQTJDO0FBRTlCLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN2QixRQUFBLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDO0FBQzVDLFFBQUEsYUFBYSxHQUFHLGtDQUFrQyxDQUFDO0FBRWhFLGVBQXNCLFFBQVEsR0FBRyxxQkFBYSxFQUFFLGFBQWEsR0FBRyxlQUFPO0lBQ25FLGFBQWEsQ0FBQyxhQUFhLENBQUMsdUNBQXVDLFFBQVEsaUJBQWlCLHFCQUFhLE1BQU0sQ0FBQyxDQUFDO0lBQ2pILG1CQUFVLENBQUMseUJBQXlCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUhELHNCQUdDO0FBRUQsZ0JBQXVCLGFBQWEsR0FBRyxlQUFPO0lBQzFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsbUJBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFIRCx3QkFHQztBQUVELGtCQUF5QixRQUFRLEdBQUcsOEJBQXNCO0lBQ3RELGVBQU8sQ0FBQyxhQUFhLENBQUMsMENBQTBDLFFBQVEsaUJBQWlCLHFCQUFhLE1BQU0sQ0FBQyxDQUFDO0lBQzlHLG1CQUFVLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBSEQsNEJBR0M7QUFFRDtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEMsbUJBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFIRCxnQ0FHQztBQUVEO0lBQ0ksU0FBUyxDQUFDO1FBQ04sTUFBTSxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQztRQUNMLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBUkQsd0RBUUMifQ==