Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const built_1 = require("protractor/built");
const character_common_1 = require("../character/character.common");
fdescribe('movement', () => {
    let newBrowser = common_1.raiseBrowser2();
    common_1.connectChars(newBrowser);
    it('should update other characters the position', () => {
        let x = ((Math.random() * 100) | 0) / 100;
        built_1.browser.executeScript(`socket.emit("movement", {x: "${x}", y: "2.2", z: "-1", angle: "45"});`);
        common_1.expectText(`"movement"`, newBrowser.instance);
        common_1.expectText(`"id": "${character_common_1.TEST_CHAR_ID}"`, newBrowser.instance);
        common_1.expectText(`"x": "${x}"`, newBrowser.instance);
        common_1.expectText(`"y": "2.2"`, newBrowser.instance);
        common_1.expectText(`"z": "-1"`, newBrowser.instance);
        common_1.expectText(`"angle": "45"`, newBrowser.instance);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL21vdmVtZW50L21vdmVtZW50LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFvRTtBQUNwRSw0Q0FBMkM7QUFDM0Msb0VBQTZEO0FBRTdELFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDbEIsSUFBSSxVQUFVLEdBQUcsc0JBQWEsRUFBRSxDQUFDO0lBQ2pDLHFCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFekIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsZ0NBQWdDLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUMvRixtQkFBVSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsbUJBQVUsQ0FBQyxVQUFVLCtCQUFZLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0QsbUJBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxtQkFBVSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsbUJBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLG1CQUFVLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=