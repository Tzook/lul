'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const MOB_SCHEMA = {
    mobId: String,
    name: String,
    hp: Number,
    lvl: Number,
    dmg: Number,
};
class MobsModel extends master_model_1.default {
    init(files, app) {
        this.controller = files.controller;
        this.schema = Object.assign({}, MOB_SCHEMA);
        this.hasId = false;
    }
    createModel() {
        this.setModel('Mobs');
        setTimeout(() => this.controller.warmMobsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
}
exports.default = MobsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFHakQsTUFBTSxVQUFVLEdBQUc7SUFDZixLQUFLLEVBQUUsTUFBTTtJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osRUFBRSxFQUFFLE1BQU07SUFDVixHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxNQUFNO0NBQ2QsQ0FBQztBQUVGLGVBQStCLFNBQVEsc0JBQVc7SUFHOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVCLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLGtDQUFrQztRQUM5RSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQWhCRCw0QkFnQkM7QUFBQSxDQUFDIn0=