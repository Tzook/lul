'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const _ = require("underscore");
class QuestsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.questsInfo = new Map();
    }
    generateQuests(quests) {
        console.log("Generating quests from data:", quests);
        let models = [];
        (quests || []).forEach(quest => {
            let questSchema = {
                key: quest.key,
            };
            {
                let conditions = [];
                (quest.conditions || []).forEach(condition => {
                    conditions.push({
                        cond: condition.condition,
                        type: condition.conditionType,
                        count: condition.targetProgress
                    });
                    questSchema.cond = conditions;
                });
            }
            {
                let req = {};
                if (quest.minLevel > 0) {
                    req.lvl = quest.minLevel;
                }
                if (quest.requiredClass) {
                    req.class = quest.requiredClass;
                }
                let reqQuests = [];
                (quest.RequiredQuests || []).forEach(reqQuest => {
                    reqQuests.push(reqQuest.key);
                    req.quests = reqQuests;
                });
                if (!_.isEmpty(req)) {
                    questSchema.req = req;
                }
            }
            {
                let rewards = {};
                if (quest.rewardClass) {
                    rewards.class = quest.rewardClass;
                }
                if (quest.rewardExp > 0) {
                    rewards.exp = quest.rewardExp;
                }
                let items = [];
                (quest.rewardItems || []).forEach(item => {
                    let rewardItem = {
                        key: item.key,
                    };
                    if (item.stack > 1) {
                        rewardItem.stack = item.stack;
                    }
                    items.push(rewardItem);
                    rewards.items = items;
                });
                if (!_.isEmpty(rewards)) {
                    questSchema.reward = rewards;
                }
            }
            let questModel = new this.Model(questSchema);
            models.push(questModel);
        });
        return this.Model.remove({})
            .then(d => this.Model.create(models));
    }
    getQuestInfo(key) {
        return this.questsInfo.get(key);
    }
    getQuests() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.questsInfo.set(doc.key, doc);
            });
            console.log("got quests");
            return this.questsInfo;
        });
    }
}
exports.default = QuestsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLG9CQUFvQyxTQUFRLHlCQUFjO0lBQTFEOztRQUNTLGVBQVUsR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQXlGMUQsQ0FBQztJQXZGVSxjQUFjLENBQUMsTUFBYTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSztZQUMzQixJQUFJLFdBQVcsR0FBZ0I7Z0JBQzlCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRzthQUNkLENBQUM7WUFFTyxDQUFDO2dCQUNHLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTO29CQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNaLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUzt3QkFDekIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxhQUFhO3dCQUM3QixLQUFLLEVBQUUsU0FBUyxDQUFDLGNBQWM7cUJBQ2xDLENBQUMsQ0FBQztvQkFDSCxXQUFXLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsQ0FBQztnQkFDRyxJQUFJLEdBQUcsR0FBdUIsRUFBRSxDQUFDO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JC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