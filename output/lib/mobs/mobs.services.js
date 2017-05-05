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
                if (minStack >= 1 && maxStack > 1) {
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
    getMobRoomId(room, mobId) {
        return `${room}-${mobId}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLGtCQUFrQyxTQUFRLHlCQUFjO0lBQXhEOztRQUNTLGFBQVEsR0FBMkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQWlFdEQsQ0FBQztJQS9ETyxZQUFZLENBQUMsSUFBVztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUN2QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBRXBCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDN0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQixDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLFNBQVMsR0FBYztnQkFDMUIsS0FBSztnQkFDTCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2dCQUNkLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsS0FBSzthQUNMLENBQUM7WUFFRixJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDMUIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSxPQUFPO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTthQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFpQjtZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQWE7UUFFOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFZLEVBQUUsS0FBYTtRQUM5QyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVNLGNBQWMsQ0FBQyxHQUFXLEVBQUUsR0FBVztRQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEVBQVUsRUFBRSxHQUFXO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRDtBQWxFRCwrQkFrRUM7QUFBQSxDQUFDIn0=