import { Config } from 'protractor';
import { raiseBrowser } from "./specs/common";

export let config: Config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    specs: [
        'specs/**/*spec.js'
    ],
    seleniumAddress: 'http://localhost:4444/wd/hub',
    onPrepare() {
        raiseBrowser();
    },

    // You could set no globals to true to avoid jQuery '$' and protractor '$'
    // collisions on the global namespace.
    noGlobals: true
};