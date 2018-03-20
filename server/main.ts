/// <reference path="./main.d.ts" />

import Main from './lib/main/main';

let main = new Main();
main.redirectIfNotSecure();
main.useDb();
main.useDependencies();
main.listenToErrors();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();