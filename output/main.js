/// <reference path="../main.d.ts" />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./lib/main/main");
let main = new main_1.default();
main.useDb();
main.useLogger();
main.useDependencies();
main.beginServer();
main.attachAppVariables();
main.connectToDbAndBootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxZQUFZLENBQUM7O0FBQ2IsMENBQW1DO0FBRW5DLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxFQUFFLENBQUM7QUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDMUIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMifQ==