'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class UserModel extends master_model_1.default {
    init(files, app) {
        this.schema = {
            username: String,
            password: String
        };
        this.listenForSchemaAddition('User');
    }
    get priority() {
        return 1;
    }
    createModel() {
        this.setModel('User');
        this.removeListen('User');
        return Promise.resolve();
    }
}
exports.default = UserModel;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvdXNlci91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZUFBK0IsU0FBUSxzQkFBVztJQUU5QyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLE1BQU07U0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBbkJELDRCQW1CQztBQUFBLENBQUMiLCJmaWxlIjoibGliL3VzZXIvdXNlci5tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmltcG9ydCBNYXN0ZXJNb2RlbCBmcm9tICcuLi9tYXN0ZXIvbWFzdGVyLm1vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlck1vZGVsIGV4dGVuZHMgTWFzdGVyTW9kZWwge1xuXG4gICAgaW5pdChmaWxlcywgYXBwKSB7XG4gICAgICAgIHRoaXMuc2NoZW1hID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBTdHJpbmdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5saXN0ZW5Gb3JTY2hlbWFBZGRpdGlvbignVXNlcicpO1xuICAgIH1cblxuICAgIGdldCBwcmlvcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kZWwoKSB7XG4gICAgICAgIHRoaXMuc2V0TW9kZWwoJ1VzZXInKTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW4oJ1VzZXInKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbn07Il19
