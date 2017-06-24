"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class DropsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = {
            key: String,
            minStack: Number,
            maxStack: Number,
        };
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel("Drop");
        this.addToSchema("Mobs", { drops: [this.model.schema] });
        return Promise.resolve();
    }
}
exports.default = DropsModel;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvZHJvcHMvZHJvcHMubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLHlEQUFpRDtBQUVqRCxnQkFBZ0MsU0FBUSxzQkFBVztJQUUvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsR0FBRyxFQUFFLE1BQU07WUFDWCxRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsTUFBTTtTQUNuQixDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQXBCRCw2QkFvQkM7QUFBQSxDQUFDIiwiZmlsZSI6ImxpYi9kcm9wcy9kcm9wcy5tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuaW1wb3J0IE1hc3Rlck1vZGVsIGZyb20gXCIuLi9tYXN0ZXIvbWFzdGVyLm1vZGVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3BzTW9kZWwgZXh0ZW5kcyBNYXN0ZXJNb2RlbCB7XG4gICAgXG4gICAgaW5pdChmaWxlcywgYXBwKSB7XG4gICAgICAgIHRoaXMuaGFzSWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY2hlbWEgPSB7XG4gICAgICAgICAgICBrZXk6IFN0cmluZyxcbiAgICAgICAgICAgIG1pblN0YWNrOiBOdW1iZXIsXG4gICAgICAgICAgICBtYXhTdGFjazogTnVtYmVyLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCBwcmlvcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDIwO1xuICAgIH1cblxuICAgIGNyZWF0ZU1vZGVsKCkge1xuICAgICAgICB0aGlzLnNldE1vZGVsKFwiRHJvcFwiKTtcbiAgICAgICAgdGhpcy5hZGRUb1NjaGVtYShcIk1vYnNcIiwge2Ryb3BzOiBbdGhpcy5tb2RlbC5zY2hlbWFdfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59OyJdfQ==
