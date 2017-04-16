Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./specs/common");
exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    specs: [
        'specs/**/*spec.js'
    ],
    seleniumAddress: 'http://localhost:4444/wd/hub',
    onPrepare() {
        common_1.raiseBrowser();
    },
    noGlobals: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDJDQUE4QztBQUVuQyxRQUFBLE1BQU0sR0FBVztJQUN4QixTQUFTLEVBQUUsU0FBUztJQUNwQixZQUFZLEVBQUU7UUFDVixXQUFXLEVBQUUsUUFBUTtLQUN4QjtJQUNELEtBQUssRUFBRTtRQUNILG1CQUFtQjtLQUN0QjtJQUNELGVBQWUsRUFBRSw4QkFBOEI7SUFDL0MsU0FBUztRQUNMLHFCQUFZLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBSUQsU0FBUyxFQUFFLElBQUk7Q0FDbEIsQ0FBQyJ9