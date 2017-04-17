import { Config } from 'protractor';
import { raiseBrowser, raiseBrowser2, connectChars } from "./specs/common";

export let config: Config = {
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
        raiseBrowser();
        if (process.argv[3] === '--suite=socket') {
            // we are in socket!
            raiseBrowser2();
            connectChars();
        }
        console.log(process.argv);
    },

    // You could set no globals to true to avoid jQuery '$' and protractor '$'
    // collisions on the global namespace.
    noGlobals: true
};