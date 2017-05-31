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
        let portals = {};
        (scene.Portals || []).forEach(portal => {
            let portalModel = {
                x: portal.PositionX,
                y: portal.PositionY,
                targetRoom: portal.TargetLevel,
                targetPortal: portal.targetPortal,
            };
            portals[portal.key] = portalModel;
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
            name: scene.name,
            town: scene.nearestTownScene,
            portals,
            spawns
        };
        let roomModel = new this.Model(room);
        let updatedDocPromise = this.Model.findOneAndUpdate({ name: room.name }, roomModel, { new: true, upsert: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBb0R4RCxDQUFDO0lBaERPLFlBQVksQ0FBRSxLQUFLO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUNuQyxJQUFJLFdBQVcsR0FBaUI7Z0JBQy9CLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUztnQkFDbkIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTO2dCQUNuQixVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVc7Z0JBQzlCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTthQUNqQyxDQUFDO1lBQ0YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1FBQy9CLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTztZQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNYLEtBQUssRUFBRSxPQUFPLENBQUMsVUFBVTtnQkFDekIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRO2dCQUNyQixRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQzdCLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUztnQkFDcEIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTO2FBQ3BCLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLEdBQWU7WUFDdEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsZ0JBQWdCO1lBQzVCLE9BQU87WUFDUCxNQUFNO1NBQ04sQ0FBQTtRQUNELElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFFLFNBQVMsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFNLGlCQUFpQixDQUFDO0lBQy9CLENBQUM7SUFFTSxRQUFRO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTthQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFrQjtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sV0FBVyxDQUFDLElBQVk7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRDtBQXJERCxnQ0FxREM7QUFBQSxDQUFDIn0=