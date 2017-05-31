'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const items_model_1 = require("./items.model");
const _ = require("underscore");
const stats_model_1 = require("../stats/stats.model");
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
            this.pushStats(itemSchema, item, "req", items_model_1.REQUIRE_SCHEMA);
            this.pushStats(itemSchema, item, "stats", stats_model_1.BASE_STATS_SCHEMA);
            let itemModel = new this.Model(itemSchema);
            models.push(itemModel);
        });
        return this.Model.remove({})
            .then(d => this.Model.create(models));
    }
    pushStats(itemSchema, item, key, schema) {
        let stats = {};
        let itemStats = item[key];
        for (var stat in schema) {
            if (itemStats && itemStats[stat] > 0) {
                stats[stat] = itemStats[stat];
            }
        }
        if (!_.isEmpty(stats)) {
            itemSchema[key] = stats;
        }
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
        let instance;
        if (itemInfo) {
            instance = {
                key: itemInfo.key
            };
            if (itemInfo.stats) {
                for (var statKey in itemInfo.stats) {
                    instance[statKey] = itemInfo.stats[statKey];
                }
            }
        }
        return instance;
    }
}
exports.default = ItemsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsK0NBQStDO0FBQy9DLGdDQUFnQztBQUNoQyxzREFBeUQ7QUFFekQsbUJBQW1DLFNBQVEseUJBQWM7SUFBekQ7O1FBQ1MsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBdUV4RCxDQUFDO0lBckVVLGFBQWEsQ0FBQyxLQUFZO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ3pCLElBQUksVUFBVSxHQUFlO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEIsQ0FBQztZQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsNEJBQWMsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsK0JBQWlCLENBQUMsQ0FBQztZQUU3RCxJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUVI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