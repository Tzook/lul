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
        return this.Model.findOneAndUpdate({ name }, roomModel, { new: true, upsert: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE2QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBOEN6RCxDQUFDO0lBNUNPLFlBQVksQ0FBRSxLQUFLO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1lBQ25DLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUc7Z0JBQzdCLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUztnQkFDbkIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTO2FBQ25CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDWCxLQUFLLEVBQUUsT0FBTyxDQUFDLFVBQVU7Z0JBQ3pCLEdBQUcsRUFBRSxPQUFPLENBQUMsUUFBUTtnQkFDckIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUM3QixDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVM7Z0JBQ3BCLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUzthQUNwQixDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxHQUFnQjtZQUN2QixJQUFJO1lBQ0osT0FBTztZQUNQLE1BQU07U0FDTixDQUFBO1FBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsSUFBSSxFQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRU0sUUFBUTtRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDL0IsSUFBSSxDQUFDLENBQUMsSUFBbUI7WUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0Q7QUEvQ0QsZ0NBK0NDO0FBQUEsQ0FBQyJ9