Object.defineProperty(exports, "__esModule", { value: true });
const failFast = require("protractor-fail-fast");
const common_1 = require("./specs/common");
exports.config = {
    framework: 'jasmine',
    plugins: [
        failFast.init(),
    ],
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
            common_1.raiseBrowser3();
            common_1.connectChars();
        }
        console.log(process.argv);
    },
    afterLaunch: () => {
        failFast.clean();
    },
    noGlobals: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlEQUFpRDtBQUVqRCwyQ0FBMEY7QUFFL0UsUUFBQSxNQUFNLEdBQVc7SUFDeEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsT0FBTyxFQUFFO1FBQ0wsUUFBUSxDQUFDLElBQUksRUFBRTtLQUNsQjtJQUNELFlBQVksRUFBRTtRQUNWLFdBQVcsRUFBRSxRQUFRO0tBQ3hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsbUJBQW1CO0tBQ3RCO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLGtDQUFrQztRQUN4QyxNQUFNLEVBQUUsa0NBQWtDO0tBQzdDO0lBQ0QsZUFBZSxFQUFFLDhCQUE4QjtJQUMvQyxTQUFTO1FBQ0wscUJBQVksRUFBRSxDQUFDO1FBQ2YsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFFdkMsc0JBQWEsRUFBRSxDQUFDO1lBQ2hCLHNCQUFhLEVBQUUsQ0FBQztZQUNoQixxQkFBWSxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDRCxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ2QsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxTQUFTLEVBQUUsSUFBSTtDQUNsQixDQUFDIn0=