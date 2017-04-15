Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
exports.createCharParams = { name: "uncaughtTestName", hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1" };
function createChar() {
    built_1.browser.executeScript(`createCharacter({name: "uncaughtTestName", hair: "hair_4b", skin: "0", mouth: "mouth_0", nose: "nose_0", eyes: "eyes_0b", g: "1"});`);
    common_1.expectText("Character has been created successfully.");
}
exports.createChar = createChar;
function deleteChar() {
    built_1.browser.executeScript(`deleteCharacter({id: characters[1]._id});`);
    common_1.expectText("Character has been deleted successfully.");
}
exports.deleteChar = deleteChar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLmNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL2NoYXJhY3Rlci9jaGFyYWN0ZXIuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRTFCLFFBQUEsZ0JBQWdCLEdBQUcsRUFBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztBQUVsSjtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMscUlBQXFJLENBQUMsQ0FBQztJQUM3SixtQkFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUhELGdDQUdDO0FBRUQ7SUFDSSxlQUFPLENBQUMsYUFBYSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDbkUsbUJBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFIRCxnQ0FHQyJ9