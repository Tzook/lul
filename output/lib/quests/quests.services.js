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
                let conditions = {};
                (quest.conditions || []).forEach(condition => {
                    conditions[condition.condition] = conditions[condition.condition] || {};
                    conditions[condition.condition][condition.conditionType] = condition.targetProgress;
                    questSchema.cond = conditions;
                });
                console.log(questSchema.cond);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLG9CQUFvQyxTQUFRLHlCQUFjO0lBQTFEOztRQUNTLGVBQVUsR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQXVGMUQsQ0FBQztJQXJGVSxjQUFjLENBQUMsTUFBYTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSztZQUMzQixJQUFJLFdBQVcsR0FBZ0I7Z0JBQzlCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRzthQUNkLENBQUM7WUFFTyxDQUFDO2dCQUNHLElBQUksVUFBVSxHQUFxQixFQUFFLENBQUM7Z0JBQ3RDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUztvQkFDdEMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDcEYsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFFRCxDQUFDO2dCQUNHLElBQUks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