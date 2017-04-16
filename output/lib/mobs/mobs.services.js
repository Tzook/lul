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
        console.log("Generating mob from data:", mobs);
        let mobModels = [];
        (mobs || []).forEach(mob => {
            let mobId = mob.key;
            let mobSchema = {
                mobId,
                name: mob.name,
                hp: mob.hp,
                lvl: mob.level,
                exp: mob.exp,
                minDmg: mob.minDMG,
                maxDmg: mob.maxDMG,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLGtCQUFrQyxTQUFRLHlCQUFjO0lBQXhEOztRQUNTLGFBQVEsR0FBNEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQW1EdkQsQ0FBQztJQWpETyxZQUFZLENBQUMsSUFBVztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9DLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUN2QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBRXBCLElBQUksU0FBUyxHQUFlO2dCQUMzQixLQUFLO2dCQUNMLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDZCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2dCQUNkLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTthQUNsQixDQUFDO1lBRUYsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQzFCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sT0FBTztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDL0IsSUFBSSxDQUFDLENBQUMsSUFBa0I7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFhO1FBRTlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxjQUFjLENBQUMsR0FBVyxFQUFFLEdBQVc7UUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFVLEVBQUUsR0FBVztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Q7QUFwREQsK0JBb0RDO0FBQUEsQ0FBQyJ9