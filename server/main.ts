/// <reference path="../main.d.ts" />
'use strict';
import Main from './lib/main/main';

let main = new Main();
main.useDb();
main.useLogger();
main.useDependencies();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();