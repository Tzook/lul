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
    suites: {
        http: 'specs/*(user|character)/*spec.js',
        socket: 'specs/!(user|character)/*spec.js',
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',
    onPrepare() {
        common_1.raiseBrowser();
        if (process.argv[3] === '--suite=socket') {
            common_1.raiseBrowser2();
            common_1.connectChars();
        }
        console.log(process.argv);
    },
    noGlobals: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDJDQUEyRTtBQUVoRSxRQUFBLE1BQU0sR0FBVztJQUN4QixTQUFTLEVBQUUsU0FBUztJQUNwQixZQUFZLEVBQUU7UUFDVixXQUFXLEVBQUUsUUFBUTtLQUN4QjtJQUNELEtBQUssRUFBRTtRQUNILG1CQUFtQjtLQUN0QjtJQUNELE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxrQ0FBa0M7UUFDeEMsTUFBTSxFQUFFLGtDQUFrQztLQUM3QztJQUNELGVBQWUsRUFBRSw4QkFBOEI7SUFDL0MsU0FBUztRQUNMLHFCQUFZLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBRXZDLHNCQUFhLEVBQUUsQ0FBQztZQUNoQixxQkFBWSxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFJRCxTQUFTLEVBQUUsSUFBSTtDQUNsQixDQUFDIn0=