'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
const _ = require("underscore");
let CLIENT_GETS = require('../../../server/lib/mobs/mobs.config.json').CLIENT_GETS;
class MobsController extends master_controller_1.default {
    constructor() {
        super();
        this.roomsMobs = new Map();
        this.mobById = new Map();
    }
    setIo(io) {
        this.io = io;
    }
    hasRoom(room) {
        return this.roomsMobs.has(room);
    }
    hasMob(id) {
        return this.mobById.has(id);
    }
    startSpawningMobs(roomInfo) {
        let roomMobs = {
            spawns: []
        };
        roomInfo.spawns.forEach(spawnInfo => {
            let spawn = Object.assign({}, spawnInfo);
            let mobsInSpawn = new Map();
            this.spawnMobs(spawn, mobsInSpawn, roomInfo.name);
            spawn.mobs = mobsInSpawn;
            roomMobs.spawns.push(spawn);
        });
        this.roomsMobs.set(roomInfo.name, roomMobs);
    }
    spawnMobs(spawnInfo, mobsInSpawn, room) {
        let mobsToSpawn = spawnInfo.cap - mobsInSpawn.size;
        console.log("spawning %d mobs", mobsToSpawn);
        for (let i = 0; i < mobsToSpawn; i++) {
            let mob = this.spawnMob(spawnInfo, room);
            mob.spawn = spawnInfo;
            mobsInSpawn.set(mob.id, mob);
        }
    }
    spawnMob(spawnInfo, room) {
        let mob = this.services.getMobInfo(spawnInfo.mobId);
        mob.id = _.uniqueId();
        mob.x = spawnInfo.x;
        mob.y = spawnInfo.y;
        this.mobById.set(mob.id, mob);
        this.notifyAboutMob(mob, this.io.to(room));
        return mob;
    }
    notifyAboutMob(mob, to) {
        to.emit(CLIENT_GETS.MOB_SPAWN, {
            mob_id: mob.id,
            x: mob.x,
            y: mob.y,
            key: mob.mobId,
            hp: mob.hp,
        });
    }
    notifyAboutMobs(socket) {
        this.roomsMobs.get(socket.character.room).spawns.forEach(spawn => {
            spawn.mobs.forEach(mob => {
                this.notifyAboutMob(mob, socket);
            });
        });
    }
    moveMob(id, x, y, socket) {
        let mob = this.mobById.get(id);
        mob.x = x;
        mob.y = y;
        socket.broadcast.to(socket.character.room).emit(CLIENT_GETS.MOB_MOVE, {
            mob_id: id,
            x,
            y,
        });
    }
    calculateDamage(socket, load) {
        let baseDmg = socket.character.stats.str;
        let bonusDmg = load * baseDmg / 100;
        let maxDmg = baseDmg + bonusDmg;
        let minDmg = maxDmg / 2;
        let dmg = this.services.getDamageRange(minDmg, maxDmg);
        return dmg;
    }
    hurtMob(id, dmg) {
        let mob = this.mobById.get(id);
        mob.hp = this.services.getHpAfterDamage(mob.hp, dmg);
        return mob;
    }
    hurtChar(id, socket) {
        let mob = this.mobById.get(id);
        let dmg = this.services.getDamageRange(mob.minDmg, mob.maxDmg);
        socket.character.stats.hp.now = this.services.getHpAfterDamage(socket.character.stats.hp.now, dmg);
        this.io.to(socket.character.room).emit(CLIENT_GETS.TAKE_DMG, {
            id: socket.character._id,
            dmg,
            hp: socket.character.stats.hp.now
        });
        console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
    }
    despawnMob(mob, room) {
        console.log("despawning mob", mob.id);
        this.io.to(room).emit(CLIENT_GETS.MOB_DIE, {
            mob_id: mob.id,
        });
        mob.spawn.mobs.delete(mob.id);
        this.mobById.delete(mob.id);
        if (mob.spawn.cap == mob.spawn.mobs.size + 1) {
            console.log("setting interval to respawn", mob.id);
            setTimeout(() => {
                this.spawnMobs(mob.spawn, mob.spawn.mobs, room);
            }, mob.spawn.interval * 1000);
        }
    }
    generateMobs(req, res, next) {
        this.services.generateMobs(req.body.mobs)
            .then(d => {
            this.sendData(res, this.LOGS.GENERATE_MOB, d);
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateMobs", file: "mobs.controller.js" });
        });
    }
    warmMobsInfo() {
        this.services.getMobs()
            .catch(e => {
            console.error("Had an error getting mobs from the db!");
            throw e;
        });
    }
}
exports.default = MobsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tb2JzL21vYnMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELGdDQUFnQztBQUNoQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFbkYsb0JBQW9DLFNBQVEsMkJBQWdCO0lBTTNEO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFMRCxjQUFTLEdBQTJCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDOUMsWUFBTyxHQUE4QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBS3ZELENBQUM7SUFFTSxLQUFLLENBQUMsRUFBRTtRQUNkLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlNLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sTUFBTSxDQUFDLEVBQVU7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxRQUFvQjtRQUM1QyxJQUFJLFFBQVEsR0FBYztZQUN6QixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ2hDLElBQUksS0FBSyxHQUFtQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUV6RCxJQUFJLFdBQVcsR0FBOEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELEtBQUssQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRVMsU0FBUyxDQUFDLFNBQXlCLEVBQUUsV0FBc0MsRUFBRSxJQUFZO1FBQ2xHLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDdEIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDRixDQUFDO0lBRVMsUUFBUSxDQUFDLFNBQXlCLEVBQUUsSUFBWTtRQUN6RCxJQUFJLEdBQUcsR0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwQixHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRVMsY0FBYyxDQUFDLEdBQWlCLEVBQUUsRUFBc0M7UUFDakYsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzlCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNkLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSztZQUNkLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtTQUNWLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBa0I7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDN0QsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDckIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxPQUFPLENBQUMsRUFBVSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBa0I7UUFDbEUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDckUsTUFBTSxFQUFFLEVBQUU7WUFDVixDQUFDO1lBQ0QsQ0FBQztTQUNELENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBa0IsRUFBRSxJQUFZO1FBQ3RELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUN6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNwQyxJQUFJLE1BQU0sR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRU0sT0FBTyxDQUFDLEVBQVUsRUFBRSxHQUFXO1FBQ3JDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRU0sUUFBUSxDQUFDLEVBQVUsRUFBRSxNQUFrQjtRQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzVELEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsR0FBRztZQUNILEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRztTQUNqQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSxVQUFVLENBQUMsR0FBaUIsRUFBRSxJQUFZO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQzFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtTQUNkLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELFVBQVUsQ0FBQztnQkFDVixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDRixDQUFDO0lBSU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM3QyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBQyxDQUFDLENBQUM7UUFDM0csQ0FBQyxDQUFDLENBQUM7SUFDRixDQUFDO0lBRUcsWUFBWTtRQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTthQUNyQixLQUFLLENBQUMsQ0FBQztZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNEO0FBekpELGlDQXlKQztBQUFBLENBQUMifQ==