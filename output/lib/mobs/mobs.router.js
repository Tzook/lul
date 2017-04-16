'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let SERVER_GETS = require('../../../server/lib/mobs/mobs.config.json').SERVER_GETS;
let statsConfig = require('../../../server/lib/stats/stats.config.json');
class MobsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.roomsRouter = files.routers.rooms;
        super.init(files, app);
    }
    initRoutes(app) {
        this.controller.setIo(this.io);
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateMobs.bind(this.controller));
    }
    [SERVER_GETS.ENTERED_ROOM](data, socket) {
        if (!this.controller.hasRoom(socket.character.room)) {
            let roomInfo = this.roomsRouter.getRoomInfo(socket.character.room);
            if (roomInfo) {
                this.controller.startSpawningMobs(roomInfo);
            }
            else {
                this.sendError({ charRoom: socket.character.room }, socket, "No room info! cannot spawn any mobs.");
            }
        }
        else {
            this.controller.notifyAboutMobs(socket);
        }
    }
    [SERVER_GETS.MOB_TAKE_DMG](data, socket) {
        if (this.controller.hasMob(data.mob_id)) {
            let load = socket.lastAttackLoad || 0;
            let dmg = this.controller.calculateDamage(socket, load);
            let mob = this.controller.hurtMob(data.mob_id, dmg);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.MOB_TAKE_DMG, {
                id: socket.character._id,
                mob_id: mob.id,
                dmg,
                load,
                hp: mob.hp,
            });
            if (mob.hp === 0) {
                this.controller.despawnMob(mob, socket.character.room);
                let exp = mob.exp || 10;
                this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP, { exp }, socket);
            }
        }
        else {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
    }
    [SERVER_GETS.MOB_MOVE](data, socket) {
        if (!socket.bitch) {
            this.sendError(data, socket, "Character is not bitch!", false);
        }
        else if (!this.controller.hasMob(data.mob_id)) {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
        else {
            this.controller.moveMob(data.mob_id, data.x, data.y, socket);
        }
    }
    [SERVER_GETS.TAKE_DMG](data, socket) {
        if (this.controller.hasMob(data.mob_id)) {
            this.controller.hurtChar(data.mob_id, socket);
        }
        else {
            this.sendError(data, socket, "Mob doesn't exist!");
        }
    }
}
exports.default = MobsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vYnMvbW9icy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUlsRSxJQUFJLFdBQVcsR0FBTyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDdkYsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFekUsZ0JBQWdDLFNBQVEsOEJBQWtCO0lBS3pELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFHO1FBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyRCxJQUFJLFFBQVEsR0FBRyxJQUFJ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