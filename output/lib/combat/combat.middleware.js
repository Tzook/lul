'use strict';
const master_middleware_1 = require("../master/master.middleware");
class CombatMiddleware extends master_middleware_1.default {
    getValidLoad(load) {
        return load >= 1 && load <= 100 ? (load | 0) : 1;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CombatMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmF0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NvbWJhdC9jb21iYXQubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixtRUFBMkQ7QUFFM0Qsc0JBQXNDLFNBQVEsMkJBQWdCO0lBQzFELFlBQVksQ0FBQyxJQUFJO1FBQ2IsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNKOztBQUpELG1DQUlDO0FBQUEsQ0FBQyJ9