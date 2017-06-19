'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class MovementModel extends master_model_1.default {
    init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: { type: Number, default: -74 },
                y: { type: Number, default: -3 },
                z: { type: Number, default: 0 },
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
exports.default = MovementModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vdmVtZW50L21vdmVtZW50Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQsbUJBQW1DLFNBQVEsc0JBQVc7SUFHbEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLG9CQUFvQixHQUFHO1lBQ3hCLFFBQVEsRUFBRTtnQkFDTixDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDL0IsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUM7Z0JBQzlCLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQzthQUNoQztTQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFyQkQsZ0NBcUJDO0FBQUEsQ0FBQyJ9