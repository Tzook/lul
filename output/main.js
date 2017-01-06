/// <reference path="../main.d.ts" />
'use strict';
const main_1 = require("./lib/main/main");
let main = new main_1.default();
main.useDb();
main.useLogger();
main.useDependencies();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxZQUFZLENBQUM7QUFDYiwwQ0FBbUM7QUFFbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztBQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUMxQixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyJ9