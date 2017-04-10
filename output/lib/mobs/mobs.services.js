'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class MobsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.mobsInfo = new Map();
    }
    generateMob(data) {
        console.log("Generating mob from data:", data);
        let mobId = data.key;
        let mob = {
            mobId,
            name: data.name,
            hp: data.hp,
            lvl: data.level,
            dmg: data.damage,
        };
        let mobModel = new this.Model(mob);
        return this.Model.findOneAndUpdate({ mobId }, mobModel, { new: true, upsert: true });
    }
    getMobs() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.mobsInfo.set(doc.name, doc);
            });
            console.log("got mobs");
            return this.mobsInfo;
        });
    }
    getMobInfo(mobId) {
        // always return a copy of the mob, so it can be modified freely
        return Object.assign({}, this.mobsInfo.get(mobId));
    }
}
exports.default = MobsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbW9icy9tb2JzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsa0JBQWtDLFNBQVEseUJBQWM7SUFBeEQ7O1FBQ1MsYUFBUSxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBbUN2RCxDQUFDO0lBakNPLFdBQVcsQ0FBRSxJQUFJO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFL0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUVmLElBQUksR0FBRyxHQUFlO1lBQ3hCLEtBQUs7WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDZixHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDYixDQUFDO1FBRVIsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsS0FBSyxFQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRU0sT0FBTztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDL0IsSUFBSSxDQUFDLENBQUMsSUFBa0I7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFhO1FBQzlCLGdFQUFnRTtRQUNoRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Q7QUFwQ0QsK0JBb0NDO0FBQUEsQ0FBQyJ9