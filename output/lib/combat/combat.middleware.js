'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
class CombatMiddleware extends master_middleware_1.default {
    getValidLoad(load) {
        return load >= 1 && load <= 100 ? (load | 0) : 0;
    }
    canChangeAbility(socket, ability) {
        return socket.character.stats.abilities.includes(ability);
    }
}
exports.default = CombatMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmF0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2NvbWJhdC9jb21iYXQubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELHNCQUFzQyxTQUFRLDJCQUFnQjtJQUNuRCxZQUFZLENBQUMsSUFBSTtRQUNwQixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsTUFBa0IsRUFBRSxPQUFlO1FBQ3ZELE1BQU0sQ0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7Q0FDSjtBQVJELG1DQVFDO0FBQUEsQ0FBQyJ9