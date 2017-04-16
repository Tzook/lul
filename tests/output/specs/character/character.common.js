Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
exports.TEST_CHAR_NAME = "test";
exports.TEST_CHAR_NAME_UNCAUGHT = "uncaughtTestName";
exports.CREATE_CHAR_PARAMS = { name: exports.TEST_CHAR_NAME_UNCAUGHT, hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1" };
exports.TEST_MAX_CHARS_USERNAME = 'testMaxChars';
function createChar(params = exports.CREATE_CHAR_PARAMS) {
    built_1.browser.executeScript(`createCharacter(${JSON.stringify(params)});`);
    common_1.expectText("Character has been created successfully.");
}
exports.createChar = createChar;
function deleteChar(index = 1) {
    built_1.browser.executeScript(`deleteCharacter({id: characters[${index}]._id});`);
    common_1.expectText("Character has been deleted successfully.");
}
exports.deleteChar = deleteChar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLmNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL2NoYXJhY3Rlci9jaGFyYWN0ZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRTFCLFFBQUEsY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUN4QixRQUFBLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDO0FBQzdDLFFBQUEsa0JBQWtCLEdBQUcsRUFBQyxJQUFJLEVBQUUsK0JBQXVCLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztBQUU1SSxRQUFBLHVCQUF1QixHQUFHLGNBQWMsQ0FBQztBQUV0RCxvQkFBMkIsTUFBTSxHQUFHLDBCQUFrQjtJQUNsRCxlQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRSxtQkFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUhELGdDQUdDO0FBRUQsb0JBQTJCLEtBQUssR0FBRyxDQUFDO0lBQ2hDLGVBQU8sQ0FBQyxhQUFhLENBQUMsbUNBQW1DLEtBQUssVUFBVSxDQUFDLENBQUM7SUFDMUUsbUJBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFIRCxnQ0FHQyJ9