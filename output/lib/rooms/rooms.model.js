'use strict';
const master_model_1 = require('../master/master.model');
class RoomsModel extends master_model_1.default {
    init(files, app) {
        this.schema = {
            name: String,
            capacity: { type: Number, default: 0 },
            users: [this.mongoose.Schema.ObjectId]
        };
        this.addToCharacterSchema = {
            room: { type: String, default: files.config.ROOM_NAMES.DEFAULT_ROOM }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3Jvb21zL3Jvb21zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBRWpELHlCQUF3QyxzQkFBVztJQUcvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDcEMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3pDLENBQUM7UUFDRixJQUFJLENBQUMsb0JBQW9CLEdBQUc7WUFDeEIsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFDO1NBQ3RFLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7QUFDTCxDQUFDO0FBdkJEOzRCQXVCQyxDQUFBO0FBQUEsQ0FBQyJ9