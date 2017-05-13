'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const items_model_1 = require("./items.model");
const _ = require("underscore");
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
            this.pushStats(itemSchema, item, "stats", items_model_1.ITEM_STATS_SCHEMA);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsK0NBQWtFO0FBQ2xFLGdDQUFnQztBQUVoQyxtQkFBbUMsU0FBUSx5QkFBYztJQUF6RDs7UUFDUyxjQUFTLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7SUF1RXhELENBQUM7SUFyRVUsYUFBYSxDQUFDLEtBQVk7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDekIsSUFBSSxVQUFVLEdBQWU7Z0JBQzVCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQ3ZCLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUTthQUNsQixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSw0QkFBYyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSwrQkFBaUIsQ0FBQyxDQUFDO1lBRTdELElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElB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