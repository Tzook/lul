'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
const _ = require("underscore");
let config = require('../../../server/lib/combat/combat.config.json');
class CombatRouter extends socketio_router_base_1.default {
    [config.SERVER_GETS.LOAD_ATTACK](data, socket) {
        console.log("loading attack", socket.character.name);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility
        });
    }
    [config.SERVER_GETS.PERFORM_ATTACK](data, socket) {
        let load = this.middleware.getValidLoad(data.load);
        console.log("performing attack", socket.character.name, data, load);
        socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK, {
            id: socket.character._id,
            ability: socket.character.stats.primaryAbility,
            load
        });
    }
    [config.SERVER_GETS.TAKE_DMG](data, socket) {
        let absoluteDmg = config.DMG[data.from];
        if (absoluteDmg) {
            // randomize the dmg
            let dmg = _.random(absoluteDmg - config.DMG_RANDOM_RANGE, absoluteDmg + config.DMG_RANDOM_RANGE);
            // make sure that after randomizing, dmg doesn't get negative
            dmg = Math.max(config.MIN_DMG_TAKEN, dmg);
            socket.character.stats.hp.now = Math.max(0, socket.character.stats.hp.now - dmg);
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.TAKE_DMG, {
                id: socket.character._id,
                dmg,
                hp: socket.character.stats.hp.now
            });
            console.log("Taking damage", socket.character.name, dmg, socket.character.stats.hp.now);
        }
        else {
            console.log("Tried to take dmg but invalid params", data.from);
        }
    }
}
exports.default = CombatRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmF0LnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvY29tYmF0L2NvbWJhdC5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUVsRSxnQ0FBZ0M7QUFDaEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFFdEUsa0JBQWtDLFNBQVEsOEJBQWtCO0lBRzNELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFO1lBQzdFLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWM7U0FDOUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDM0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFO1lBQ2hGLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWM7WUFDOUMsSUFBSTtTQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQ3JELElBQUksV0FBVyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkIsb0JBQW9CO1lBQ1gsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUMxRyw2REFBNkQ7WUFDN0QsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7Z0JBQzlELEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7Z0JBQ3hCLEdBQUc7Z0JBQ0gsRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHO2FBQ3BDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsQ0FBQztJQUNSLENBQUM7Q0FDRDtBQXZDRCwrQkF1Q0M7QUFBQSxDQUFDIn0=