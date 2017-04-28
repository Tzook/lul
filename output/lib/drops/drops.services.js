'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const _ = require("underscore");
class DropsServices extends master_services_1.default {
    getRandomStack(min, max) {
        return _.random(min || 1, max || 1);
    }
}
exports.default = DropsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2Ryb3BzL2Ryb3BzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLG1CQUFtQyxTQUFRLHlCQUFjO0lBQ2pELGNBQWMsQ0FBQyxHQUFZLEVBQUUsR0FBWTtRQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Q7QUFKRCxnQ0FJQztBQUFBLENBQUMifQ==