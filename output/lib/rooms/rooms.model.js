'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class RoomsModel extends master_model_1.default {
    init(files, app) {
        let portal = this.mongoose.Schema({
            target: String,
            x: Number,
            y: Number,
        }, { _id: false });
        let spawn = this.mongoose.Schema({
            mob: String,
            cap: Number,
            interval: Number,
            x: Number,
            y: Number,
        }, { _id: false });
        this.schema = {
            name: String,
            portals: [portal],
            spawns: [spawn]
        };
        this.hasId = false;
        this.addToCharacterSchema = {
            room: { type: String, default: files.config.DEFAULT_ROOM }
        };
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.setModel('Rooms');
        this.addToSchema('Character', this.addToCharacterSchema);
        return Promise.resolve();
    }
}
exports.default = RoomsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsZ0JBQWdDLFNBQVEsc0JBQVc7SUFHL0MsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDOUIsTUFBTSxFQUFFLE1BQU07WUFDZCxDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSxNQUFNO1NBQ1osRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRWpCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzdCLEdBQUcsRUFBRSxNQUFNO1lBQ1gsR0FBRyxFQUFFLE1BQU07WUFDWCxRQUFRLEVBQUUsTUFBTTtZQUNoQixDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSxNQUFNO1NBQ1osRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUNqQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDbEIsQ0FBQztRQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxvQkFBb0IsR0FBRztZQUN4QixJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBQztTQUMzRCxDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUF2Q0QsNkJBdUNDO0FBQUEsQ0FBQyJ9