'use strict';
let main = new (require(`${__dirname}/lib/main/main.js`))();

main.useDb();
main.useLogger();
main.useDependencies();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();