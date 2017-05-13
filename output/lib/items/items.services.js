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
            this.pushStats(itemSchema, item, "stats", items_model_1.STATS_SCHEMA);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL2l0ZW1zL2l0ZW1zLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsK0NBQTZEO0FBQzdELGdDQUFnQztBQUVoQyxtQkFBbUMsU0FBUSx5QkFBYztJQUF6RDs7UUFDUyxjQUFTLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7SUF1RXhELENBQUM7SUFyRVUsYUFBYSxDQUFDLEtBQVk7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDekIsSUFBSSxVQUFVLEdBQWU7Z0JBQzVCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQ3ZCLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUTthQUNsQixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSw0QkFBYyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSwwQkFBWSxDQUFDLENBQUM7WUFFeEQsSUFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFB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