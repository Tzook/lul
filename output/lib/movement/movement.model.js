'use strict';
const master_model_1 = require('../master/master.model');
class MovementModel extends master_model_1.default {
    init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: { type: Number, default: 0 },
                y: { type: Number, default: 0 },
                z: { type: Number, default: 0 }
            }
        };
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.addToSchema('Character', this.addToCharacterSchema);
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovementModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vdmVtZW50L21vdmVtZW50Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBRWpELDRCQUEyQyxzQkFBVztJQUdsRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsb0JBQW9CLEdBQUc7WUFDeEIsUUFBUSxFQUFFO2dCQUNOLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztnQkFDN0IsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO2dCQUM3QixDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7YUFDaEM7U0FDSixDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztBQUNMLENBQUM7QUFyQkQ7K0JBcUJDLENBQUE7QUFBQSxDQUFDIn0=