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
            let drops = [];
            (mob.drops || []).forEach(drop => {
                let { key, minStack, maxStack } = drop;
                if (minStack && maxStack) {
                    drops.push({ key, minStack, maxStack });
                }
                else {
                    drops.push({ key });
                }
            });
            let mobSchema = {
                mobId,
                hp: mob.hp,
                lvl: mob.level,
                exp: mob.exp,
                minDmg: mob.minDMG,
                maxDmg: mob.maxDMG,
                drops,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLGtCQUFrQyxTQUFRLHlCQUFjO0lBQXhEOztRQUNTLGFBQVEsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQTZEdEQsQ0FBQztJQTNETyxZQUFZLENBQUMsSUFBVztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUN2QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBRXBCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDN0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDckIsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxTQUFTLEdBQWM7Z0JBQzFCLEtBQUs7Z0JBQ0wsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNWLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSztnQkFDZCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7Z0JBQ1osTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLEtBQUs7YUFDTCxDQUFDO1lBRUYsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQzFCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sT0FBTztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDL0IsSUFBSSxDQUFDLENBQUMsSUFBaUI7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFhO1FBRTlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxjQUFjLENBQUMsR0FBVyxFQUFFLEdBQVc7UUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFVLEVBQUUsR0FBVztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Q7QUE5REQsK0JBOERDO0FBQUEsQ0FBQyJ9