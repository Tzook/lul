'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class RoomsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.roomsInfo = new Map();
    }
    generateRoom(scene) {
        console.log("Generating room from scene:", scene);
        let name = scene.name;
        let portals = {};
        (scene.Portals || []).forEach(portal => {
            portals[portal.TargetLevel] = {
                x: portal.PositionX,
                y: portal.PositionY
            };
        });
        let spawns = [];
        (scene.Spawners || []).forEach(spawner => {
            spawns.push({
                mobId: spawner.MonsterKey,
                cap: spawner.SpawnCap,
                interval: spawner.RespawnTime,
                x: spawner.PositionX,
                y: spawner.PositionY
            });
        });
        let room = {
            name,
            portals,
            spawns
        };
        let roomModel = new this.Model(room);
        let updatedDocPromise = this.Model.findOneAndUpdate({ name }, roomModel, { new: true, upsert: true });
        return updatedDocPromise;
    }
    getRooms() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.roomsInfo.set(doc.name, doc);
            });
            console.log("got rooms");
            return this.roomsInfo;
        });
    }
    getRoomInfo(room) {
        return this.roomsInfo.get(room);
    }
}
exports.default = RoomsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBK0N4RCxDQUFDO0lBN0NPLFlBQVksQ0FBRSxLQUFLO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1lBQ25DLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUc7Z0JBQzdCLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUztnQkFDbkIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTO2FBQ25CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDWCxLQUFLLEVBQUUsT0FBTyxDQUFDLFVBQVU7Z0JBQ3pCLEdBQUcsRUFBRSxPQUFPLENBQUMsUUFBUTtnQkFDckIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUM3QixDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVM7Z0JBQ3BCLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUzthQUNwQixDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxHQUFlO1lBQ3RCLElBQUk7WUFDSixPQUFPO1lBQ1AsTUFBTTtTQUNOLENBQUE7UUFDRCxJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsSUFBSSxFQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRyxNQUFNLENBQU0saUJBQWlCLENBQUM7SUFDL0IsQ0FBQztJQUVNLFFBQVE7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFO2FBQy9CLElBQUksQ0FBQyxDQUFDLElBQWtCO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxXQUFXLENBQUMsSUFBWTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNEO0FBaERELGdDQWdEQztBQUFBLENBQUMifQ==