'use strict';
const master_model_1 = require('../master/master.model');
class ItemsModel extends master_model_1.default {
    init(files, app) {
        this.hasId = false;
        this.schema = {
            name: String,
            icon: String,
        };
    }
    get priority() {
        return 25;
    }
    createModel() {
        this.setModel('Item');
        this.addToSchema('Character', { items: [this.getModel().schema] });
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBRWpELHlCQUF3QyxzQkFBVztJQUMvQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsTUFBTTtTQUNmLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDakUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0FBQ0wsQ0FBQztBQW5CRDs0QkFtQkMsQ0FBQTtBQUFBLENBQUMifQ==