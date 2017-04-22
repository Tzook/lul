'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const _ = require("underscore");
class MobsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.mobsInfo = new Map();
    }
    generateMobs(mobs) {
        console.log("Generating mobs from data:", mobs);
        let mobModels = [];
        (mobs || []).forEach(mob => {
            let mobId = mob.key;
            let mobSchema = {
                mobId,
                hp: mob.hp,
                lvl: mob.level,
                exp: mob.exp,
                minDmg: mob.minDMG,
                maxDmg: mob.maxDMG,
                drops: mob.drops,
            };
            let mobModel = new this.Model(mobSchema);
            mobModels.push(mobModel);
        });
        return this.Model.remove({})
            .then(d => this.Model.create(mobModels));
    }
    getMobs() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.mobsInfo.set(doc.mobId, doc);
            });
            console.log("got mobs");
            return this.mobsInfo;
        });
    }
    getMobInfo(mobId) {
        return Object.assign({}, this.mobsInfo.get(mobId));
    }
    getDamageRange(min, max) {
        return _.random(Math.floor(min) || 1, Math.floor(max));
    }
    getHpAfterDamage(hp, dmg) {
        return Math.max(0, Math.floor(hp - dmg));
    }
}
exports.default = MobsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLGtCQUFrQyxTQUFRLHlCQUFjO0lBQXhEOztRQUNTLGFBQVEsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQW1EdEQsQ0FBQztJQWpETyxZQUFZLENBQUMsSUFBVztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUN2QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBRXBCLElBQUksU0FBUyxHQUFjO2dCQUMxQixLQUFLO2dCQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDVixHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUs7Z0JBQ2QsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO2dCQUNaLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7YUFDaEIsQ0FBQztZQUVGLElBQUksUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUMxQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE9BQU87UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFO2FBQy9CLElBQUksQ0FBQyxDQUFDLElBQWlCO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxVQUFVLENBQUMsS0FBYTtRQUU5QixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sY0FBYyxDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsRUFBVSxFQUFFLEdBQVc7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNEO0FBcERELCtCQW9EQztBQUFBLENBQUMifQ==