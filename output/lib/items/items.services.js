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
        return itemInfo ? { key: itemInfo.key } : undefined;
    }
}
exports.default = ItemsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBMkN4RCxDQUFDO0lBekNVLGFBQWEsQ0FBQyxLQUFZO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ3pCLElBQUksVUFBVSxHQUFlO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ3ZCLENBQUM7WUFFRixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDMUIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFUyxRQUFRO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDL0IsSUFBSSxDQUFDLENBQUMsSUFBa0I7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxHQUFXO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sZUFBZSxDQUFDLEdBQVc7UUFFakMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUMsR0FBRyxTQUFTLENBQUM7SUFDbkQsQ0FBQztDQUNEO0FBNUNELGdDQTRDQztBQUFBLENBQUMifQ==