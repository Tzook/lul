"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class GoldModel extends master_model_1.default {
    get priority() {
        return 20;
    }
    createModel() {
        this.addToSchema("Character", { gold: { type: Number, default: 0 } });
        return Promise.resolve();
    }
}
exports.default = GoldModel;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvZ29sZC9nb2xkLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZUFBK0IsU0FBUSxzQkFBVztJQUM5QyxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQVRELDRCQVNDO0FBQUEsQ0FBQyIsImZpbGUiOiJsaWIvZ29sZC9nb2xkLm1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgTWFzdGVyTW9kZWwgZnJvbSBcIi4uL21hc3Rlci9tYXN0ZXIubW9kZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR29sZE1vZGVsIGV4dGVuZHMgTWFzdGVyTW9kZWwge1xuICAgIGdldCBwcmlvcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDIwO1xuICAgIH1cblxuICAgIGNyZWF0ZU1vZGVsKCkge1xuICAgICAgICB0aGlzLmFkZFRvU2NoZW1hKFwiQ2hhcmFjdGVyXCIsIHsgZ29sZDoge3R5cGU6IE51bWJlciwgZGVmYXVsdDogMH0gfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59OyJdfQ==
