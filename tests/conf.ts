import * as failFast from 'protractor-fail-fast';
import { Config } from 'protractor';
import { raiseBrowser, raiseBrowser2, raiseBrowser3, connectChars } from './specs/common';

export let config: Config = {
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
        raiseBrowser();
        if (process.argv[3] === '--suite=socket') {
            // we are in socket!
            raiseBrowser2();
            raiseBrowser3();
            connectChars();
        }
        console.log(process.argv);
    },
    afterLaunch: () => {
        failFast.clean(); 
    },
    noGlobals: true
};