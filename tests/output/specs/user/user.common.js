Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
exports.TEST_USERNAME = 'test';
exports.TEST_USERNAME_UNCAUGHT = 'uncaughtTestName';
exports.TEST_PASSWORD = '12345678123456781234567812345678';
function login(username = exports.TEST_USERNAME) {
    built_1.browser.executeScript(`sendPost('/user/login', {username: '${username}', password: '${exports.TEST_PASSWORD}'});`);
    common_1.expectText("Logged in successfully.");
}
exports.login = login;
function register(username = exports.TEST_USERNAME_UNCAUGHT) {
    built_1.browser.executeScript(`sendPost('/user/register', {username: '${username}', password: '${exports.TEST_PASSWORD}'});`);
    common_1.expectText("Registered and then logged in successfully.");
}
exports.register = register;
function logout() {
    built_1.browser.executeScript(`logout()`);
    common_1.expectText("Logged out successfully.");
}
exports.logout = logout;
function deleteUser() {
    built_1.browser.executeScript(`deleteUser()`);
    common_1.expectText("User successfully deleted.");
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3VzZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsNENBQTJDO0FBRTlCLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN2QixRQUFBLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDO0FBQzVDLFFBQUEsYUFBYSxHQUFHLGtDQUFrQyxDQUFDO0FBRWhFLGVBQXNCLFFBQVEsR0FBRyxxQkFBYTtJQUMxQyxlQUFPLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxRQUFRLGlCQUFpQixxQkFBYSxNQUFNLENBQUMsQ0FBQztJQUMzRyxtQkFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUhELHNCQUdDO0FBRUQsa0JBQXlCLFFBQVEsR0FBRyw4QkFBc0I7SUFDdEQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsUUFBUSxpQkFBaUIscUJBQWEsTUFBTSxDQUFDLENBQUM7SUFDOUcsbUJBQVUsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFIRCw0QkFHQztBQUVEO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxtQkFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUhELHdCQUdDO0FBRUQ7SUFDSSxlQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLG1CQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBSEQsZ0NBR0MifQ==