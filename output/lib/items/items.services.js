'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class ItemsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.itemsInfo = new Map();
    }
    generateItems(items) {
        console.log("Generating items from data:", items);
        let models = [];
        (items || []).forEach(item => {
            let itemSchema = {
                key: item.key,
                type: item.type,
                gold: item.goldValue,
                chance: item.dropChance,
                cap: item.stackCap,
            };
            let itemModel = new this.Model(itemSchema);
            models.push(itemModel);
        });
        return this.Model.remove({})
            .then(d => this.Model.create(models));
    }
    getItems() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.itemsInfo.set(doc.key, doc);
            });
            console.log("got items");
            return this.itemsInfo;
        });
    }
    getItemInfo(key) {
        return this.itemsInfo.get(key);
    }
    getItemInstance(key) {
        let itemInfo = this.getItemInfo(key);
        return itemInfo ? { key: itemInfo.key, stack: 1 } : undefined;
    }
}
exports.default = ItemsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBNEN4RCxDQUFDO0lBMUNVLGFBQWEsQ0FBQyxLQUFZO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ3pCLElBQUksVUFBVSxHQUFlO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEIsQ0FBQztZQUVGLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUMxQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVTLFFBQVE7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTthQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFrQjtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sV0FBVyxDQUFDLEdBQVc7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxlQUFlLENBQUMsR0FBVztRQUVqQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzdELENBQUM7Q0FDRDtBQTdDRCxnQ0E2Q0M7QUFBQSxDQUFDIn0=