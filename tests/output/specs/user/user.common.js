Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
exports.TEST_USERNAME = 'test';
exports.TEST_USERNAME2 = 'test2';
exports.TEST_USERNAME3 = 'test3';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy91c2VyL3VzZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBdUM7QUFDdkMsNENBQTJDO0FBRTlCLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN2QixRQUFBLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDekIsUUFBQSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLFFBQUEsc0JBQXNCLEdBQUcsa0JBQWtCLENBQUM7QUFDNUMsUUFBQSxhQUFhLEdBQUcsa0NBQWtDLENBQUM7QUFFaEUsZUFBc0IsUUFBUSxHQUFHLHFCQUFhLEVBQUUsYUFBYSxHQUFHLGVBQU87SUFDbkUsYUFBYSxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsUUFBUSxpQkFBaUIscUJBQWEsTUFBTSxDQUFDLENBQUM7SUFDakgsbUJBQVUsQ0FBQyx5QkFBeUIsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBSEQsc0JBR0M7QUFFRCxnQkFBdUIsYUFBYSxHQUFHLGVBQU87SUFDMUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxtQkFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUhELHdCQUdDO0FBRUQsa0JBQXlCLFFBQVEsR0FBRyw4QkFBc0I7SUFDdEQsZUFBTyxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsUUFBUSxpQkFBaUIscUJBQWEsTUFBTSxDQUFDLENBQUM7SUFDOUcsbUJBQVUsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFIRCw0QkFHQztBQUVEO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0QyxtQkFBVSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUhELGdDQUdDO0FBRUQ7SUFDSSxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ1gsTUFBTSxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDVixLQUFLLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVJELHdEQVFDIn0=