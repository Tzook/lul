/// <reference path="../main.d.ts" />
'use strict';
const main_1 = require('./lib/main/main');
let main = new main_1.default();
main.useDb();
main.useLogger();
main.useDependencies();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxZQUFZLENBQUM7QUFDYix1QkFBaUIsaUJBQWlCLENBQUMsQ0FBQTtBQUVuQyxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDO0FBQ3RCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQzFCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDIn0=