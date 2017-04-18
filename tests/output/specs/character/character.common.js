Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
exports.TEST_CHAR_NAME = "test";
exports.TEST_CHAR_ID = "58f1d663d1656c7a428c7c23";
exports.TEST_CHAR_NAME2 = "test2";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLmNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL2NoYXJhY3Rlci9jaGFyYWN0ZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRTFCLFFBQUEsY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUN4QixRQUFBLFlBQVksR0FBRywwQkFBMEIsQ0FBQztBQUMxQyxRQUFBLGVBQWUsR0FBRyxPQUFPLENBQUM7QUFDMUIsUUFBQSx1QkFBdUIsR0FBRyxrQkFBa0IsQ0FBQztBQUM3QyxRQUFBLGtCQUFrQixHQUFHLEVBQUMsSUFBSSxFQUFFLCtCQUF1QixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUM7QUFFNUksUUFBQSx1QkFBdUIsR0FBRyxjQUFjLENBQUM7QUFFdEQsb0JBQTJCLE1BQU0sR0FBRywwQkFBa0I7SUFDbEQsZUFBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckUsbUJBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFIRCxnQ0FHQztBQUVELG9CQUEyQixLQUFLLEdBQUcsQ0FBQztJQUNoQyxlQUFPLENBQUMsYUFBYSxDQUFDLG1DQUFtQyxLQUFLLFVBQVUsQ0FBQyxDQUFDO0lBQzFFLG1CQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBSEQsZ0NBR0MifQ==