Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
function login() {
    built_1.browser.executeScript(`sendPost('/user/login', {username: 'test', password: '12345678123456781234567812345678'});`);
    common_1.expectText("Logged in successfully.");
}
exports.login = login;
function register() {
    built_1.browser.executeScript(`sendPost('/user/register', {username: 'uncaughtTestName', password: '12345678123456781234567812345678'});`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3VzZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsNENBQTJDO0FBRTNDO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0lBQ3BILG1CQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBSEQsc0JBR0M7QUFFRDtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMsMkdBQTJHLENBQUMsQ0FBQztJQUNuSSxtQkFBVSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUhELDRCQUdDO0FBRUQ7SUFDSSxlQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLG1CQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBSEQsd0JBR0M7QUFFRDtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEMsbUJBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFIRCxnQ0FHQyJ9