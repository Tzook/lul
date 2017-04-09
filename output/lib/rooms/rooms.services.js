'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class RoomsServices extends master_services_1.default {
    generateRoom(scene) {
        console.log("Generating room from scene:", scene);
        let name = scene.name;
        let portals = (scene.Portals || []).map(portal => ({
            target: portal.TargetLevel,
            x: portal.PositionX,
            y: portal.PositionY
        }));
        let spawns = (scene.Spawners || []).map(spawner => ({
            mob: spawner.MonsterKey,
            cap: spawner.SpawnCap,
            interval: spawner.RespawnTime,
            x: spawner.PositionX,
            y: spawner.PositionY
        }));
        let room = new this.Model({
            name,
            portals,
            spawns,
        });
        return this.Model.findOneAndUpdate({ name }, room, { new: true, upsert: true });
    }
}
exports.default = RoomsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFDakQsWUFBWSxDQUFFLEtBQUs7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDbEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQzFCLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUztZQUNuQixDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FDbkIsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxDQUFDO1lBQ25ELEdBQUcsRUFBRSxPQUFPLENBQUMsVUFBVTtZQUN2QixHQUFHLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDckIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQzdCLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUNwQixDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVM7U0FDcEIsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsSUFBSTtZQUNKLE9BQU87WUFDUCxNQUFNO1NBQ04sQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxJQUFJLEVBQUMsRUFBRSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7Q0FDRDtBQXhCRCxnQ0F3QkM7QUFBQSxDQUFDIn0=